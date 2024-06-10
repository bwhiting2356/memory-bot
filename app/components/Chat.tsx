import { useContext, useEffect, useMemo, useRef } from 'react';

import { Message, useChat } from 'ai/react';
import { Input } from '@/components/ui/input';
import MessageComponent from './MessageComponent';
import { StopCircle, ArrowCircleUp, } from '@phosphor-icons/react';
import { MessageBotContext } from '../state/context';

export default function Chat() {
    const { userId } = useContext(MessageBotContext);
    const { input, handleInputChange, messages, error, handleSubmit, stop, isLoading } = useChat();

    const onHandleSubmit = (e: any) => {
        e.preventDefault();
        handleSubmit(e, { data: { userId } });
    };

    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const showSkeleton = useMemo(() => {
        const lastMessage = messages[messages.length - 1];
        return lastMessage?.role !== 'assistant' && isLoading;
    }, [isLoading, messages]);

    useEffect(() => {
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [messages]);

    return (
        <div
            className={`flex flex-col overflow-y-scroll items-center justify-between max-h-screen text-sm w-1/3 h-full border-r transition-width duration-300 relative`}
        >
            {
                <div className="flex flex-col w-full mx-auto flex-grow px-2">
                    <div className="my-4">
                        <h2 className="font-bold text-xl">Memory Bot</h2>
                    </div>
                    {error != null && (
                        <div className="relative px-6 py-4 text-white bg-red-500 rounded-md">
                            <span className="block sm:inline">
                                Error: {(error as any).toString()}
                            </span>
                        </div>
                    )}
                    {messages.map((m: Message) => (
                        <MessageComponent key={m.id} message={m} />
                    ))}
                    {showSkeleton && <MessageComponent />}
                    <div ref={messagesEndRef} />
                </div>
            }
            <div className="w-full sticky bottom-0 p-2 border-t border-gray-300 bg-white">
                <form onSubmit={onHandleSubmit} className="flex w-full items-center space-x-2">
                    <Input
                        ref={inputRef}
                        disabled={isLoading}
                        className="flex-grow p-2 border border-gray-300 rounded-l shadow-xl"
                        value={input}
                        placeholder="What do you want to chat about today?"
                        onChange={handleInputChange}
                    />
                    <button
                        type="submit"
                        className={`p-2 rounded text-white bg-gray-700`}
                        onClick={isLoading ? stop : undefined}
                    >
                        {isLoading ? <StopCircle size={20} /> : <ArrowCircleUp size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
