'use client';

import Explanation from './components/Explanation';
import Chat from './components/Chat';
import { MessageBotProvider } from './state/context';

export default function Home() {
    return (
        <main className="flex h-screen flex items-center justify-between">
            <MessageBotProvider>
                <Chat />
                <Explanation />
            </MessageBotProvider>
        </main>
    );
}
