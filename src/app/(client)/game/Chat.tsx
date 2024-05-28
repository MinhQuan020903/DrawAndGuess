'use client';

import { cn } from '@/lib/utils';
import { ScrollShadow } from '@nextui-org/react';
import {
  FC,
  HTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface ChatProps extends HTMLAttributes<HTMLDivElement> {
  socket: any;
  user: any;
}

const Chat: FC<ChatProps> = ({ className, ...props }) => {
  const [messages, setMessages] = useState([]);
  const inverseMessages = [...messages].reverse();

  // Scroll to bottom when new message is added
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  //Multiple drop lines
  function MultipleLinesParagraph(text: string) {
    const descriptionWithLineBreaks = text.split('\n').map((text, index) => (
      <span key={index}>
        {text}
        <br />
      </span>
    ));

    return <p>{descriptionWithLineBreaks}</p>;
  }

  return (
    <ScrollShadow
      ref={chatContainerRef}
      isEnabled={false}
      hideScrollBar
      className={cn('h-[600px] p-2', className)}
    >
      <div {...props} className={cn('flex flex-col-reverse gap-3 ', className)}>
        <div className="flex-1" />
        {inverseMessages.map((message, index) => {
          return (
            <div className="chat-message" key={index}>
              <div>
                <div
                  className={cn(
                    'flex flex-col space-y-2 text-sm max-w-xl mx-2 overflow-x-hidden shadow-md rounded-lg'
                  )}
                >
                  <p
                    className={cn(
                      'px-4 py-2 rounded-lg bg-gradient-to-r from-primary-400 to-primary text-black'
                    )}
                  >
                    {MultipleLinesParagraph(message)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>{' '}
    </ScrollShadow>
  );
};

export default Chat;
