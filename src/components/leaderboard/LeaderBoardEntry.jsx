import { Flex, Center, Text, Avatar, ScaleFade, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { memo, useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { FaPencilAlt } from 'react-icons/fa';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const LeaderBoardEntry = ({ row }) => {
  const [newRow, setNewRow] = useState();
  const [oldRow, setOldRow] = useState();

  useEffect(() => {
    async function setRows() {
      // If there has been a change in dollarVolume
      if (oldRow && oldRow.points !== row.points) {
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
            scale: newRow.points == oldRow.points ? '1' : '1.03',
          }}
        >
          <Flex
            flexDir={'row'}
            py={3}
            px={1}
            mb={3}
            flexGrow={1}
            borderRadius="lg"
            w="200px"
            backgroundColor={'white'}
            borderLeft="2px"
            borderColor={
              newRow.points == oldRow.points ? 'teal.100' : 'teal.400'
            }
            h="60px"
            justify={'space-between'}
          >
            <Flex flexGrow={1} flexDir="row">
              <Center>
                <div size="sm" className="w-4 justify-center align-middle">
                  {row.currentTurn && <Icon as={FaPencilAlt} color={'blue'} />}
                </div>

                <Avatar
                  mr={2}
                  src={`https://api.dicebear.com/5.x/big-smile/svg?seed=${row.detail.avatar}`}
                  size="sm"
                ></Avatar>
                <Flex flexDir={'column'}>
                  <Text
                    fontWeight={
                      newRow.points == oldRow.points ? 'normal' : 'semibold'
                    }
                    fontSize="sm"
                    color={'black'}
                  >
                    {row.detail.username}
                  </Text>
                  <Text
                    as="em"
                    color={'blue.600'}
                    fontSize="xs"
                    fontWeight={
                      newRow.points == oldRow.points ? 'normal' : 'extrabold'
                    }
                  >
                    <CountUp
                      suffix=" pts"
                      separator=","
                      duration={2}
                      start={oldRow.points}
                      end={newRow.points}
                    />
                  </Text>
                </Flex>
              </Center>
            </Flex>
          </Flex>
        </motion.div>
      )}
    </>
  );
};

export default LeaderBoardEntry;
