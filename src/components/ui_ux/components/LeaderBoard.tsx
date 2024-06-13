'use client';
import React, { useEffect, useState, useReducer, useCallback } from 'react';
import {
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Text,
  Flex,
  Avatar,
  Center,
  TagRightIcon,
  VStack,
  Heading,
  Select,
  Button,
  Tag,
  Stack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
} from '@chakra-ui/react';
import {
  FiArrowDown,
  FiCheckCircle,
  FiChevronDown,
  FiCircle,
  FiCornerDownRight,
  FiRefreshCcw,
} from 'react-icons/fi';
import { Reorder } from 'framer-motion';
import LeaderBoardEntry from '@/components/leaderboard/LeaderBoardEntry';

export default function LeaderBoard({ currentData, setPlayers }) {
  const [sortedData, setSortedData] = useState();

  useEffect(() => {
    const sortData = () => {
      if (currentData) {
        setSortedData(sortArrayByProperty('points'));
      }
    };
    sortData();
  }, [setPlayers, currentData]);

  const sortArrayByProperty = (prop) => {
    return [...currentData].sort((a, b) => b[`${prop}`] - a[`${prop}`]);
  };

  return (
    <>
      <Flex p={3} flexDir={'column'} w="250px">
        {sortedData && (
          <>
            <Center>
              <Heading mb={5} as="em" size="md">
                <Flex flexDir={'column'}>
                  <Center>
                    <Flex mb={3} alignItems="center" flexDir="column">
                      <Progress
                        mt="2px"
                        width="100%"
                        height={'2px'}
                        colorScheme={'red'}
                        size="xs"
                        isIndeterminate
                      />
                    </Flex>
                  </Center>
                </Flex>
              </Heading>
            </Center>
            <Flex p={2}>
              <Reorder.Group
                as="div"
                draggable={false}
                dragControls={false}
                dragListener={false}
                axis="y"
                values={sortedData}
              >
                {sortedData.map((row) => {
                  return (
                    <Reorder.Item
                      as="div"
                      key={`${row.id}`}
                      dragListener={false}
                      draggable={false}
                      value={row}
                    >
                      <LeaderBoardEntry row={row} />
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            </Flex>
          </>
        )}
      </Flex>
    </>
  );
}
