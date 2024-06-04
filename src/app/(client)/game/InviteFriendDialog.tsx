import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@chakra-ui/react';
import { Player } from '@/types/types';
import InviteFriendToRoom from './InviteFriendToRoomCard';

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
        <Button color={'blue'}>Invite friend</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay fixed inset-0 bg-black bg-opacity-50 z-40" />
        <Dialog.Content className="DialogContent fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50">
          <Dialog.Title className="DialogTitle">
            Invite Your Friend
          </Dialog.Title>

          <div className="w-8 h-8"></div>
          {friends.map((friend, index) => (
            <div className="w-full h-fit" key={index}>
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
