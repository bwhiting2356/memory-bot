import React, { useContext } from 'react';
import { MessageBotContext } from '../state/context';

export default function Explanation() {
    const { userId } = useContext(MessageBotContext);

    return (
        <div
            className={`flex flex-col h-screen overflow-scroll px-4 justify-start transition-width duration-300 w-2/3`}
        >
            <div>
                <div className="my-4">
                    <h2 className="font-bold text-xl">How it Works</h2>
                </div>
                <div className="text-normal text-gray-700 mr-12">
                    <p>
                        This is a demo of how a chatbot can have &apos;unlimited&apos; memory of
                        past chat messages using RAG.
                    </p>
                    <p>
                        To keep it simple, there is no auth here - you have been assigned a random
                        user id that&apos;s saved to local storage. All messages are upserted into{' '}
                        <a className="underline" target="_blank" href="https://www.pinecone.io/">
                            Pinecone
                        </a>{' '}
                        with metadata that links the record to this user id. Then, for any messages
                        you send, the messages are embedded and a query is sent to pinecone to find
                        similar messages for your user id from the history.
                    </p>
                    <p>Try discussing a topic, refreshing the page, and see if it remembers your previous discussion on the topic.</p>
                </div>
            </div>
        </div>
    );
}
