'use client';
import {
  Center,
  Text,
  Flex,
  Spinner,
  UnorderedList,
  ListItem,
  Link,
} from '@chakra-ui/react';
import LeaderBoard from '../../../components/leaderboard/LeaderBoard';
import { useState, useEffect, useCallback } from 'react';
import data from '../../../components/leaderboard/data.json';

// Initial data is read from data.json
// Every 5 seconds, a random entry is selected and its values are incremented

function App() {
  const [currentData, setCurrentData] = useState(data);
  const timer = 5000;

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  useEffect(() => {
    const incrementData = () => {
      let chosenIndex = getRandomInt(currentData.length);
      let newCurrentData = currentData.map((item, i) => {
        return chosenIndex === i
          ? {
              ...item,
              dollarVolumeLifetime: (item.dollarVolumeLifetime += 20000000),
              noFundedLifetime: (item.noFundedLifetime += 5),
            }
          : { ...item };
      });
      setCurrentData([...newCurrentData]);
    };
    incrementData();
    const interval = setInterval(() => {
      incrementData();
    }, [timer]);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  return (
    <>
      {currentData && (
        <>
          <Flex flexDir={'row'} justify="space-evenly">
            <Flex mt="auto" mb="auto" maxW="350px" justify="center">
              <UnorderedList>
                <ListItem>
                  This purpose of this LeaderBoard is to give recognition and
                  visiblity to salespeople
                </ListItem>
                <ListItem>
                  <Link
                    isExternal
                    href="https://www.npmjs.com/package/framer-motion"
                    color="teal.500"
                  >
                    framer-motion
                  </Link>{' '}
                  and
                  <Link
                    isExternal
                    href="https://www.npmjs.com/package/react-countup"
                    color="teal.500"
                  >
                    {' '}
                    react-countup
                  </Link>{' '}
                  were used to animate the LeaderBoard after a new sale was made
                </ListItem>
                <ListItem>
                  This demo increments a random persons data every 5 seconds to
                  simulate a sale
                </ListItem>
                <ListItem>
                  View the source code here:{' '}
                  <Link
                    isExternal
                    href="https://github.com/bfeelin/bfeelin.github.io"
                    color="teal.500"
                  >
                    https://github.com/bfeelin/bfeelin.github.io
                  </Link>
                </ListItem>
              </UnorderedList>
            </Flex>
            <LeaderBoard currentData={currentData} />
          </Flex>
        </>
      )}
    </>
  );
}

export default App;
