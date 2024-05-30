'use client';
import { Flex } from '@chakra-ui/react';
import LeaderBoard from './LeaderBoard';
import { useState, useEffect, useCallback } from 'react';
import data from './data.json';

// Initial data is read from data.json
// Every 5 seconds, a random entry is selected and its values are incremented

function LeaderBoardComponent({ socket }) {
  const [currentData, setCurrentData] = useState(data);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  useEffect(() => {
    // const incrementData = () => {
    //   let chosenIndex = getRandomInt(currentData.length);
    //   let newCurrentData = currentData.map((item, i) => {
    //     return chosenIndex === i
    //       ? {
    //           ...item,
    //           points: (item.points += 10),
    //         }
    //       : { ...item };
    //   });
    //   setCurrentData([...newCurrentData]);
    // };
    // incrementData();
    // const interval = setInterval(() => {
    //   incrementData();
    // }, [timer]);

    // return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    socket.on('server-list-players', (data) => {
      console.log('🚀 ~ socket.on ~ data:', data);
      setCurrentData(data);
    });
  }, [socket]);
  return (
    <>
      {currentData && (
        <>
          <Flex flexDir={'row'} justify="space-evenly">
            <LeaderBoard currentData={currentData} />
          </Flex>
        </>
      )}
    </>
  );
}

export default LeaderBoardComponent;
