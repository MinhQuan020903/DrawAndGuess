import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Button, Select } from '@chakra-ui/react';
import useRoom from '@/hooks/useRoom';
import Loader from '@/components/Loader';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface RoomInputs {
  capacity: number;
  maxScore: number;
  selectedTopic: string;
  selectedPrivacy: string;
}

const formSchema = z.object({
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  maxScore: z.number().min(1, 'Max Score must be at least 1'),
  selectedTopic: z.string().nonempty('Topic is required'),
  selectedPrivacy: z.enum(['Public', 'Private']),
});

const HostDialog = ({ user, router, socket }) => {
  const [topics, setTopics] = useState([]);
  const [selectedPrivacy, setSelectedPrivacy] = useState('Public');

  const { onGetTopics } = useRoom(user);

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await onGetTopics();
      setTopics(data);
    };
    fetchTopics();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RoomInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      capacity: 0,
      maxScore: 0,
      selectedPrivacy: 'Public',
      selectedTopic: '',
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    const topicsWithId = topics.map((topic, index) => ({
      ...topic,
      id: index + 1,
    }));
    const topic = topicsWithId.find(
      (topic) => topic.name === data.selectedTopic
    );
    const isPublic = data.selectedPrivacy == 'Public';
    if (socket) {
      socket.emit('create-room', {
        capacity: data.capacity,
        maxScore: data.maxScore,
        topicId: topic.id,
        isPublic: isPublic,
        username: user.username,
      });
      socket.on('room-created', (data) => {
        router.push('/game/' + data);
      });
    }
    return () => {
      socket.off('create-room');
    };
  };

  if (!topics) return <Loader />;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button className="m-10 bg-blue-500">NEW ROOM</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay fixed inset-0 bg-black bg-opacity-50 z-40" />
        <Dialog.Content className="DialogContent fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Dialog.Title className="DialogTitle">Host Room</Dialog.Title>
            <Dialog.Description className="DialogDescription">
              Create a new room
            </Dialog.Description>
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="capacity">
                Capacity
              </label>
              <input
                className="Input"
                id="capacity"
                type="number"
                {...register('capacity', { valueAsNumber: true })}
              />
            </fieldset>
            {errors.capacity && (
              <p className="text-red-500">{errors.capacity.message}</p>
            )}
            <fieldset className="Fieldset">
              <label className="Label" htmlFor="maxScore">
                Max Score
              </label>
              <input
                className="Input"
                id="maxScore"
                type="number"
                {...register('maxScore', { valueAsNumber: true })}
              />
            </fieldset>
            {errors.maxScore && (
              <p className="text-red-500">{errors.maxScore.message}</p>
            )}
            <label className="Label" htmlFor="selectedTopic">
              Topic
            </label>
            <Select
              placeholder="Select a topic"
              textColor={'purple'}
              {...register('selectedTopic')}
            >
              {topics.map((topic, index) => (
                <option key={index} value={topic.name}>
                  {topic?.name}
                </option>
              ))}
            </Select>
            {errors.selectedTopic && (
              <p className="text-red-500">{errors.selectedTopic.message}</p>
            )}
            <div className="w-full h-fit flex flex-row gap-5 justify-evenly items-center my-3">
              <span className="text-violet-700">Room type</span>
              <RadioGroup.Root
                className="RadioGroupRoot"
                aria-label="Room type"
                value={selectedPrivacy}
                onValueChange={(value) => {
                  setSelectedPrivacy(value);
                  setValue('selectedPrivacy', value);
                }}
              >
                <div className="w-full h-fit flex flex-row gap-3 my-2 justify-center">
                  <div className="w-32 flex flex-row gap-3 justify-center items-center">
                    <RadioGroup.Item
                      className="RadioGroupItem"
                      value="Public"
                      id="rb-public"
                    >
                      <RadioGroup.Indicator className="RadioGroupIndicator" />
                    </RadioGroup.Item>
                    <label className="w-fit" htmlFor="rb-public">
                      Public
                    </label>
                  </div>
                  <div className="flex flex-row gap-3 justify-center items-center">
                    <RadioGroup.Item
                      className="RadioGroupItem"
                      value="Private"
                      id="rb-private"
                    >
                      <RadioGroup.Indicator className="RadioGroupIndicator" />
                    </RadioGroup.Item>
                    <label className="w-fit" htmlFor="rb-private">
                      Private
                    </label>
                  </div>
                </div>
              </RadioGroup.Root>
              {errors.selectedPrivacy && (
                <p className="text-red-500">{errors.selectedPrivacy.message}</p>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 25,
                justifyContent: 'flex-end',
              }}
            >
              <button type="submit" className="Button green">
                Save changes
              </button>
            </div>
            <Dialog.Close asChild>
              <button className="IconButton" aria-label="Close">
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default HostDialog;
