'use client';

import { createContext, useContext, useState } from 'react';

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const sendMessage = (text) => {
    // Basic mock implementation for initial deployment
    setMessages([...messages, { text, sender: 'me', timestamp: new Date() }]);
  };

  return (
    <ChatContext.Provider value={{ messages, activeChat, setActiveChat, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
