import { Button } from '@chakra-ui/react';
import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';

const FriendRequestCard = ({ username, user, userSocket }) => {
  return (
    <div className="w-full h-full flex flex-row justify-between items-center">
      <span>{username}</span>
      <div className="w-fit gap-2 flex flex-row items-center">
        <Button
          bgColor={'white'}
          size={'sm'}
          shadow={'sm'}
          color={'green'}
          onClick={() => {
            userSocket.emit('response-friend-request', {
              receiver: user.username,
              sender: username,
              accept: true,
            });
          }}
        >
          <FaCheck />
        </Button>
        <Button
          bgColor={'white'}
          size={'sm'}
          shadow={'sm'}
          onClick={() => {
            userSocket.emit('response-friend-request', {
              receiver: user.username,
              sender: username,
              accept: false,
            });
          }}
        >
          <FaXmark />
        </Button>
      </div>
    </div>
  );
};

export default FriendRequestCard;
