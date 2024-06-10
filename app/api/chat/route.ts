import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { MessageMetadata, TOP_K, queryMessages, upsertMessages } from '../pinecone';
import { ScoredPineconeRecord } from '@pinecone-database/pinecone';

const model = 'gpt-4o';

async function saveChat(chat: { text: string; userId: string }) {
    const { text, userId } = chat;
    const metadata = {
        message: text,
        date: new Date().toISOString(),
        userId: userId,
    };

    await upsertMessages([metadata]);
}

async function getSimilarHistoricalMessages(messages: string[], userId: string) {
    const combinedMessages = messages.map(({ content }: any) => content).join(' ');
    const response = await queryMessages(combinedMessages, userId);
    return response.matches;
}

const promptTemplate = `
You are a helpful assistant. 
Your purpose is to demo how a RAG can be used to provide a chatbot with 'unlimited' memory of a user's message history. 
Below you have been provided with the top ${TOP_K} historical messages related to the user's most recent message. They may or may not be useful in responding, but please keep them in mind.

<historical_messages>
{{historical_messages}}
</historical_messages>
`;

const buildSystemPromptWithRAGHistory = async (messages: string[], userId: string) => {
    const historicalMessages = await getSimilarHistoricalMessages(messages, userId);
    const reformmatedMessages = historicalMessages
        .map(({ metadata }: ScoredPineconeRecord<MessageMetadata>) => ({
            message: metadata?.message,
            date: metadata?.date,
        }))
        .filter(({ message, date }) => Boolean(message) && Boolean(date))
        .map(({ message, date }) => `${date}: ${message}`)
        .join('\n');
    return promptTemplate.replace('{{historical_messages}}', reformmatedMessages);
};

export async function POST(req: Request) {
    const {
        messages,
        data: { userId },
    } = await req.json();
    const systemPrompt = await buildSystemPromptWithRAGHistory(messages, userId);
    console.log('systemPrompt', systemPrompt);

    const result = await streamText({
        model: openai(model),
        system: systemPrompt,
        messages: convertToCoreMessages(messages),
        async onFinish({ text }) {
            const pastMessages = messages.slice(-3);
            const formattedMessages = `
date: ${new Date().toISOString()}
${pastMessages.map((msg: any) => `${msg.role}: ${msg.content}`).join('\n')}
assistant: ${text}
            `;
            await saveChat({ text: formattedMessages, userId });
        },
    });

    return result.toAIStreamResponse();
}
