// @ts-nocheck
import { useEffect, useRef } from 'react';
import { Message } from '../Message';
import type { ChatMessage } from '../../types/messages';
import './MessageContainer.css';
import { hardcodedMessages } from './hardcoded';

export const MessageContainer = ({ messages }: { messages: ChatMessage[] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // the way this is written it will always be called

  // return (
  //   <section className="messages-container">
  //     {hardcodedMessages.map(msg => (
  //       <Message key={msg.id} msg={msg} />
  //     ))}
  //     <div ref={bottomRef} />
  //   </section>
  // );
  return (
    <section className="messages-container">
      {messages.map(msg => (
        <Message key={msg.id} msg={msg} />
      ))}
      <div ref={bottomRef} />
    </section>
  );
};
