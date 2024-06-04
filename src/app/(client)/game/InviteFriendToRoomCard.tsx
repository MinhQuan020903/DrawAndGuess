import { Player } from '@/types/types';
import { Button } from '@chakra-ui/react';
import React from 'react';
import { FiUserPlus } from 'react-icons/fi';

const InviteFriendToRoom = ({
  username,
  friendUsername,
  roomId,
  players,
  isOnline,
  userSocket,
  onCloseDialog,
}: {
  username: string;
  friendUsername: string;
  roomId: string;
  players: Player[];
  isOnline: boolean;
  userSocket: any;
  onCloseDialog: () => void;
}) => {
  console.log('🚀 ~ players:', players);
  return (
    <div className="w-full h-full flex flex-row gap-3 justify-between items-center">
      <div className="w-fit gap-2 flex flex-row items-center">
        <span>{friendUsername}</span>
        <div
          className={`w-2 h-2 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></div>
      </div>
      {(!players.find(
        (player) =>
          player.detail.username === friendUsername &&
          player.detail.username !== username
      ) ||
        players.length == 1) && (
        <Button
          bgColor={'white'}
          size={'sm'}
          shadow={'sm'}
          onClick={() => {
            onCloseDialog();
            userSocket.emit('invite-friend-to-room', {
              sender: username,
              receiver: friendUsername,
              roomId: roomId,
            });
          }}
        >
          <FiUserPlus />
        </Button>
      )}
    </div>
  );
};

export default InviteFriendToRoom;
