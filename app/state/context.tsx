import { createContext } from 'react';

import { useUserId } from '@/lib/useUserId';

interface MessageBotStateType {
    userId: string;
}

const initialContextState: MessageBotStateType = {
    userId: '',
};

export const MessageBotContext = createContext<MessageBotStateType>(initialContextState);

interface MessageBotProviderProps {
    children: React.ReactNode;
}

export const MessageBotProvider = ({ children }: MessageBotProviderProps) => {
    const userId = useUserId();

    return <MessageBotContext.Provider value={{ userId }}>{children}</MessageBotContext.Provider>;
};
