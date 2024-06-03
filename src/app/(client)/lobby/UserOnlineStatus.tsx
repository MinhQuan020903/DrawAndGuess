import { Button } from '@chakra-ui/react';
import React from 'react';
import { FiUserPlus } from 'react-icons/fi';

const UserOnlineStatusCard = ({
  user,
  username,
  isOnline,
  isFriend,
  userSocket,
}) => {
  return (
    <div className="w-full h-full flex flex-row gap-3 justify-between items-center">
      <div className="w-fit gap-2 flex flex-row items-center">
        <span>{username}</span>
        <div
          className={`w-2 h-2 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></div>
      </div>
      {!isFriend && (
        <Button
          bgColor={'white'}
          size={'sm'}
          shadow={'sm'}
          onClick={() => {
            userSocket.emit('send-friend-request', {
              sender: user.username,
              receiver: username,
            });
          }}
        >
          <FiUserPlus />
        </Button>
      )}
    </div>
  );
};

export default UserOnlineStatusCard;
