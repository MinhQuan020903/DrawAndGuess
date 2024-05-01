import { Flex, Center, Text, Avatar, ScaleFade } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { memo, useEffect, useState } from 'react';
import CountUp from 'react-countup';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const LeaderBoardEntry = ({ row }) => {
  const [newRow, setNewRow] = useState();
  const [oldRow, setOldRow] = useState();

  useEffect(() => {
    async function setRows() {
      // If there has been a change in dollarVolume
      if (oldRow && oldRow.dollarVolumeLifetime !== row.dollarVolumeLifetime) {
        setNewRow(row);
        await delay(2100);
        setOldRow(row);
      }
      // If this is the first render
      else {
        setNewRow(row);
        setOldRow(row);
      }
    }
    setRows();
  }, [row]);

  return (
    <>
      {oldRow && newRow && (
        <motion.div
          animate={{
            scale:
              newRow.dollarVolumeLifetime == oldRow.dollarVolumeLifetime
                ? '1'
                : '1.03',
          }}
        >
          <Flex
            flexDir={'row'}
            key={`row-${row.LO.Name}`}
            py={3}
            px={1}
            mb={3}
            flexGrow={1}
            borderRadius="lg"
            w="200px"
            borderLeft="2px"
            borderColor={
              newRow.dollarVolumeLifetime == oldRow.dollarVolumeLifetime
                ? 'teal.100'
                : 'teal.400'
            }
            h="40px"
            justify={'space-between'}
          >
            <Flex flexGrow={1} flexDir="row">
              <Center>
                <Avatar
                  key={`${row.LO.Name}-avatar`}
                  mr={2}
                  src={`https://api.dicebear.com/5.x/big-smile/svg?seed=${row.LO.Name}`}
                  size="sm"
                ></Avatar>
                <Flex key={row.LO.Name} flexDir={'column'}>
                  <Text
                    fontWeight={
                      newRow.dollarVolumeLifetime == oldRow.dollarVolumeLifetime
                        ? 'normal'
                        : 'semibold'
                    }
                    fontSize="sm"
                  >
                    {row.LO.Name}
                  </Text>
                  <Text
                    as="em"
                    color={'gray.600'}
                    fontSize="xs"
                    fontWeight={
                      newRow.dollarVolumeLifetime == oldRow.dollarVolumeLifetime
                        ? 'normal'
                        : 'extrabold'
                    }
                  >
                    <CountUp
                      prefix="$"
                      separator=","
                      duration={2}
                      start={oldRow.dollarVolumeLifetime}
                      end={newRow.dollarVolumeLifetime}
                    />
                  </Text>
                </Flex>
              </Center>
            </Flex>
            <Text fontWeight={'semibold'} fontSize="xl">
              <CountUp
                separator=","
                duration={2}
                start={oldRow.noFundedLifetime}
                end={newRow.noFundedLifetime}
              />
            </Text>
          </Flex>
        </motion.div>
      )}
    </>
  );
};

export default LeaderBoardEntry;
