import { Card, Text, Badge, Group, Title , Modal,Tooltip,TextInput,
  Button,
  ScrollArea,
  Stack, } from '@mantine/core';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';


import { useEffect, useRef, useState  } from 'react';



import dayjs from 'dayjs';


import { Calendar } from '@mantine/dates';


const PartnerInfoCard = ({ partner }) => {
  if (!partner) {
    return <Text c="red">No accountability partner assigned</Text>;
  }

  return (
    <Card withBorder radius="md" mb="md">
      <Title order={5}>Accountability Partner</Title>
      <Text fw={500} mt="xs">{partner.username}</Text>
      <Text size="sm" color="dimmed">{partner.email}</Text>
      <Group mt="xs">
        <Badge color={partner.confirmed ? 'green' : 'red'}>
          {partner.confirmed ? 'Confirmed' : 'Unconfirmed'}
        </Badge>
        <Badge color={partner.blocked ? 'red' : 'green'}>
          {partner.blocked ? 'Blocked' : 'Active'}
        </Badge>
      </Group>
    </Card>
  );
};



const HabitInfoCard = ({ habit }) => {
  if (!habit) return null;

  const { description, frequency, endDate, completedDates } = habit;

  return (
    <Card withBorder radius="md" mb="md">
      <Title order={5}>Habit Details</Title>
      <Text fw={500} mt="xs">{description}</Text>

      <Group mt="xs" spacing="xl">
        <Text size="sm">
          <strong>Frequency:</strong> {frequency}
        </Text>
        <Text size="sm">
          <strong>End Date:</strong> {endDate}
        </Text>
        <Text size="sm">
          <strong>Completed:</strong> {completedDates?.length || 0}
        </Text>
      </Group>
    </Card>
  );
};



const CheckInViewerModal = ({ opened, onClose, completedDates = [] }) => {
  const parsedDates = completedDates.map((date) => new Date(date));

  return (
    <Modal opened={opened} onClose={onClose} title="Check-in History" centered>
      <Calendar
        getDayProps={(date) => {
          const isCheckedIn = parsedDates.some(
            (d) => dayjs(d).isSame(date, 'day')
          );
          return {
            selected: isCheckedIn,
            style: {
              backgroundColor: isCheckedIn ? '#4caf50' : undefined,
              color: isCheckedIn ? 'white' : undefined,
            },
          };
        }}
      />
    </Modal>
  );
};



const MissedCheckinBadge = ({ completedDates = [] }) => {
  const today = dayjs().startOf('day');

  const hasCheckedInToday = completedDates.some((date) =>
    dayjs(date).isSame(today, 'day')
  );

  if (hasCheckedInToday) return null;

  return (
    <Tooltip label="No check-in recorded for today">
      <Badge color="red" variant="filled">
        ⚠ Missed Today
      </Badge>
    </Tooltip>
  );
};



const WeeklyCheckinChart = ({ completedDates = [] }) => {
  const today = dayjs();
  const last7Days = Array.from({ length: 7 }).map((_, i) =>
    today.subtract(6 - i, 'day').startOf('day')
  );

  const chartData = last7Days.map((day) => {
    const formatted = day.format('ddd'); 
    const count = completedDates.some((d) => dayjs(d).isSame(day, 'day')) ? 1 : 0;
    return { day: formatted, checkIns: count };
  });

  return (
    <Card withBorder radius="md" mt="md">
      <Title order={6} mb="xs">
        Weekly Check-in Overview
      </Title>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData}>
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="checkIns" fill="#4caf50" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

const PartnerChatBox = ({ currentUser, partner }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef();

  const fetchMessages = async () => {
    console.log(currentUser)
    try {
      const res = await fetch(
        `http://localhost:1337/api/messages?filters[$or][0][sender][id][$eq]=${currentUser.id}&filters[$or][1][receiver][id][$eq]=${currentUser.id}&populate=sender`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      const data = await res.json();
      console.log(data)
      const filtered = data.data.filter(
        (msg) =>
          (msg.attributes.sender.data.id === currentUser.id &&
            msg.attributes.receiver.data.id === partner.id) ||
          (msg.attributes.sender.data.id === partner.id &&
            msg.attributes.receiver.data.id === currentUser.id)
      );
      setMessages(filtered);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      await fetch(`http://localhost:1337/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          data: {
            sender: currentUser.id,
            receiver: partner.id,
            message: input.trim(),
          },
        }),
      });

      setInput('');
      fetchMessages();
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card withBorder radius="md" mt="md">
      <Title order={6} mb="xs">
        Partner Chat
      </Title>

      <ScrollArea h={200} mb="sm" p="xs">
        <Stack spacing="xs">
          {messages.map((msg) => {
            console.log(msg)
            const isMine = msg.attributes.sender.data.id === currentUser.id;
            return (
              <Group
                key={msg.id}
                position={isMine ? 'right' : 'left'}
                align="start"
              >
                <Text
                  p="xs"
                  bg={isMine ? 'blue.0' : 'gray.0'}
                  style={{
                    borderRadius: 8,
                    maxWidth: '60%',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  <strong>{msg.sender?.data.username}:</strong>{' '}
                  {msg.message}
                  <Text size="xs" c="dimmed" mt={4}>
                    {dayjs(msg.attributes.createdAt).format('HH:mm')}
                  </Text>
                </Text>
              </Group>
            );
          })}
          <div ref={scrollRef} />
        </Stack>
      </ScrollArea>

      <Group>
        <TextInput
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Button onClick={sendMessage}>Send</Button>
      </Group>
    </Card>
  );
};





export { HabitInfoCard, PartnerInfoCard, CheckInViewerModal,MissedCheckinBadge, WeeklyCheckinChart, PartnerChatBox};
