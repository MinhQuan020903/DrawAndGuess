'use client';

import { cn } from '@/lib/utils';
import { Player } from '@/types/types';
import { Input, InputGroup, InputRightAddon } from '@chakra-ui/react';

import {
  FC,
  HTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FiNavigation } from 'react-icons/fi';

interface ChatProps extends HTMLAttributes<HTMLDivElement> {
  socket: any;
  user: any;
  roomId: any;
  isPlayer: boolean;
  keyword: string;
  timer: number;
  totalTimer: number;
  setPlayers: any;
}

interface GuessMessage {
  message: string;
  guessKeyword: string | null;
  isCorrect: boolean;
}

const Chat: FC<ChatProps> = ({ className, ...props }) => {
  const [messages, setMessages] = useState<GuessMessage[]>([]);

  const [guess, setGuess] = useState(''); // Guess word
  const [input, setInput] = useState('');
  const inverseMessages = [...messages].reverse();

  // Scroll to bottom when new message is added
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (props.socket) {
      if (guess !== '') {
        console.log('Guess: ', guess);
        props.socket.emit('send-guess', {
          id: props.user.id,
          username: props.user.username,
          guess: guess,
          guessPoint: Math.round((props.timer * 100) / props.totalTimer),
        });
      }
    }
  }, [guess]);

  useEffect(() => {
    props.socket.on('validate-guess', (data) => {
      if (data.isCorrect) {
        console.log('Correct Guess', data);
        props.setPlayers((prevPlayers: Player[]) => {
          return prevPlayers.map((player) => {
            if (player.id == data.userId) {
              return {
                ...player,
                points: player.points + data.guessPoint,
              };
            }
            return player;
          });
        });
      }
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    return () => {
      props.socket.off('validate-guess');
    };
  }, [props.socket]);

  //   //Multiple drop lines
  //   function MultipleLinesParagraph(text: string) {
  //     const descriptionWithLineBreaks = text.split('\n').map((text, index) => (
  //       <span key={index}>
  //         {text}
  //         <br />
  //       </span>
  //     ));

  //     return <p>{descriptionWithLineBreaks}</p>;
  //   }

  return (
    <div
      className={cn(
        className,
        `flex flex-col gap-3 bg-transparent justify-center items-center`
      )}
    >
      <div
        ref={chatContainerRef}
        className={cn(
          'w-full h-full p-2 overflow-auto bg-white rounded-lg border flex flex-col items-center'
        )}
      >
        <span className="w-full text-center text-cyan-600 text-lg font-bold">
          Answers
        </span>
        <div {...props} className={cn('w-full flex flex-col-reverse gap-3')}>
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
                      {message.isCorrect ? (
                        <span className="font-bold text-green-500">
                          {message.message}
                        </span>
                      ) : (
                        <div className="w-full space-x-1">
                          <span className="font-bold ">{message.message}</span>

                          <span className="text-yellow-400 font-bold">
                            {message.guessKeyword}
                          </span>
                        </div>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>{' '}
      </div>
      {!props.isPlayer && (
        <InputGroup className="bg-white rounded-lg">
          {' '}
          <Input
            variant="filled"
            value={input}
            className=" text-black rounded-lg"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();

                if (input !== '') {
                  setGuess(input);
                  setInput('');
                }
              }
            }}
            onChange={(e) => setInput(e.target.value)}
          ></Input>
          <InputRightAddon className="bg-primary-400 hover:bg-slate-300 rounded-lg">
            <FiNavigation
              className="text-cyan-700 "
              onClick={() => {
                if (input !== '') {
                  setGuess(input);
                  setInput('');
                }
              }}
            />
          </InputRightAddon>
        </InputGroup>
      )}
    </div>
  );
};

export default Chat;
