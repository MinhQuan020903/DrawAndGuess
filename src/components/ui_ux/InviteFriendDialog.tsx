import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@chakra-ui/react';
import { Player } from '@/types/types';
import InviteFriendToRoom from './InviteFriendToRoomCard';
import { FiUsers } from 'react-icons/fi';

const InviteFriendDialog = ({
  username,
  friends,
  roomId,
  players,
  isOnline,
  userSocket,
}: {
  username: string;
  friends: string[];
  roomId: string;
  players: Player[];
  isOnline: boolean;
  userSocket: any;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
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
          size={'lg'}
          textColor={'white'}
        >
          Invite friend
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay fixed inset-0 bg-black bg-opacity-50 z-40" />
        <Dialog.Content className="w-[60%] lg:w-[20%] h-[60%] gap-3 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50">
          <div className="w-full h-8 mb-8 flex flex-row justify-between items-center">
            <Dialog.Title className="DialogTitle">
              Invite Your Friend
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button
                dropShadow={'outline'}
                bgColor={'red.600'}
                rounded={'xl'}
                _hover={{
                  boxShadow: 'outline',
                  shadow: 'outline',
                  bgColor: 'red.500',
                }}
                size={'sm'}
                textColor={'white'}
              >
                X
              </Button>
            </Dialog.Close>
          </div>

          <div className="w-full h-fit"></div>
          {friends.map((friend, index) => (
            <div className="w-full h-fit my-2" key={index}>
              <InviteFriendToRoom
                username={username}
                friendUsername={friend}
                roomId={roomId}
                players={players}
                isOnline={isOnline}
                userSocket={userSocket}
                onCloseDialog={() => setIsOpen(false)}
              />
            </div>
          ))}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default InviteFriendDialog;
