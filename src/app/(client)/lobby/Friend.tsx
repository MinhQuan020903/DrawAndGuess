import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@chakra-ui/react';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import UserOnlineStatusCard from './UserOnlineStatus';
import FriendRequestCard from './FriendRequestCard';
import { FiUsers } from 'react-icons/fi';

const Friend = ({ userSocket, user }) => {
  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (!userSocket) return;

    userSocket.on('new-user', () => {
      userSocket.emit('get-users', { username: user.username });
      userSocket.emit('get-friends', { username: user.username });
    });

    // userSocket.emit('get-users', { username: user.username });

    userSocket.on('users', (data) => {
      console.log('users', data);
      if (Array.isArray(data)) {
        setUsers(data);
      }
    });

    userSocket.emit('get-friend-requests', { username: user.username });
    userSocket.emit('get-friends', { username: user.username });

    userSocket.on('friend-requests', (data) => {
      console.log('friend-requests', data);
      setFriendRequests([...friendRequests, data]);
    });

    userSocket.on('friend-request', (data) => {
      console.log('friend-request', data.receiver);
      if (data.receiver == user.username) {
        setFriendRequests([...friendRequests, data.sender]);
      }
      console.log('🚀 ~ userSocket.on ~ friendRequest:', friendRequests);
    });
    userSocket.on('friend-request-response', (data) => {
      if (data.accept) {
        if (data.sender == user.username || data.receiver == user.username) {
          userSocket.emit('get-users', { username: user.username });
          userSocket.emit('get-friends', { username: user.username });
          userSocket.emit('get-friend-requests', { username: user.username });
        }
      }
    });

    userSocket.on('friends', (data) => {
      console.log('friends', data);
      setFriends(data);
    });

    userSocket.on('user-disconnected', () => {
      userSocket.emit('get-users', { username: user.username });
      userSocket.emit('get-friends', { username: user.username });
    });

    return () => {
      userSocket.off('users');
      userSocket.off('friend-requests');
      userSocket.off('friend-request');
      userSocket.off('friend-request-response');
      userSocket.off('friends');
      userSocket.off('user-disconnected');
    };
  }, [userSocket]);

  return (
    <div className="flex flex-1 w-full flex-row justify-center items-center content-center ">
      <div className="flex space-x-2 self-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              dropShadow={'outline'}
              bgColor={'blue.600'}
              rounded={'xl'}
              leftIcon={<FiUsers />}
              _hover={{
                boxShadow: 'outline',
                shadow: 'outline',
                bgColor: 'blue.500',
              }}
              textColor={'white'}
              className="z-50 rounded-full justify-between items-center content-center bg-white shadow-md hover:shadow-lg"
            >
              <div className="transform duration-200 hover:scale-105 flex items-center justify-center cursor-pointer">
                Friends
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col">
            <SheetHeader className="px-1">
              <SheetTitle>Friends List</SheetTitle>
            </SheetHeader>
            <Separator />
            <ScrollArea className="my-2 h-[calc(100vh-8rem)] pb-10 pl-6 pr-5">
              <div className="space-y-4">
                <Accordion
                  type="multiple"
                  className="w-full overflow-auto no-scrollbar"
                >
                  <AccordionItem value="online">
                    <AccordionTrigger className="text-sm">
                      Lobby
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="w-full flex flex-col gap-2">
                        {users.length > 0 ? (
                          users.map((u, index) => {
                            if (user.username != u && u != '') {
                              return (
                                <div key={index}>
                                  <UserOnlineStatusCard
                                    username={u}
                                    isOnline={true}
                                    user={user}
                                    isFriend={false}
                                    userSocket={userSocket}
                                  />
                                </div>
                              );
                            }
                            return null;
                          })
                        ) : (
                          <p>No users online</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="friends">
                    <AccordionTrigger className="text-sm">
                      Friends
                    </AccordionTrigger>
                    <AccordionContent>
                      {
                        <div className="w-full flex flex-col gap-2">
                          {friends.length > 0 ? (
                            friends.map((f, index) => {
                              if (f != '' && f != user.username) {
                                console.log('?????' + f);
                                return (
                                  <div key={index}>
                                    <UserOnlineStatusCard
                                      username={f}
                                      isOnline={true}
                                      user={user}
                                      isFriend={true}
                                      userSocket={userSocket}
                                    />
                                  </div>
                                );
                              }
                              return null;
                            })
                          ) : (
                            <p>No friends online</p>
                          )}
                        </div>
                      }
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="requests">
                    <AccordionTrigger className="text-sm">
                      Requests
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col">
                        {friendRequests.length > 0 &&
                          friendRequests.map((username, index) => {
                            if (username != '' && username != user.username) {
                              return (
                                <div key={index}>
                                  <FriendRequestCard
                                    username={username}
                                    user={user}
                                    userSocket={userSocket}
                                  />
                                </div>
                              );
                            }
                            return null;
                          })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </ScrollArea>
            <Separator className="my-4" />
            <SheetFooter></SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Friend;
