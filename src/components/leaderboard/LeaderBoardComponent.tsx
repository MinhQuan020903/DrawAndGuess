'use client';
import { Flex } from '@chakra-ui/react';
import LeaderBoard from './LeaderBoard';
import { useState, useEffect, useCallback } from 'react';

// Initial data is read from data.json
// Every 5 seconds, a random entry is selected and its values are incremented

function LeaderBoardComponent({ socket, isPlaying, players, setPlayers }) {
  useEffect(() => {
    if (!socket) return;

    socket.on('server-list-players', (data) => {
      setPlayers(data);
    });

    return () => {
      socket.off('server-list-players');
    };
  }, [socket]);
  return (
    <>
      {players.length > 0 && (
        <>
          <Flex flexDir={'row'} justify="space-evenly">
            <LeaderBoard currentData={players} setPlayers={setPlayers} />
          </Flex>
        </>
      )}
    </>
  );
}

export default LeaderBoardComponent;
