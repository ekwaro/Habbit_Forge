import { Card, Text, Badge, Group, Title , Modal,Tooltip,TextInput,
  Button,
  ScrollArea,
  Textarea,
  Menu,
  Indicator,
  ActionIcon,
  Rating,
  Stack} from '@mantine/core';

import { IconBell } from '@tabler/icons-react'

import { BarChart, Bar, XAxis, YAxis,  ResponsiveContainer } from 'recharts';
import { useEffect, useRef, useState  } from 'react';
import dayjs from 'dayjs';
import { Calendar } from '@mantine/dates';
import useStrapiHabits from '../habits/useLocalStorage'

import { notifications } from '@mantine/notifications';

const PartnerInfoCard = ({partner}) => {
  // const {list} = useStrapiHabits()
   //partner = list.filter((habit)=>habit.accountabilityPartner)
  if (!partner) {
    return <Text color="red">No accountability partner assigned</Text>;
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

const PartnerChatBox = ({ currentUser, partner , habitId}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef();
  const hasMounted = useRef(false);

  const token =
    localStorage.getItem('authToken') 

  const fetchMessages = async () => {
     const url = new URL('http://localhost:1337/api/messages');
    url.searchParams.append('filters[$or][0][sender][id][$eq]', currentUser.id);
    url.searchParams.append('filters[$or][1][receiver][id][$eq]', currentUser.id);
    url.searchParams.append('filters[habit][id][$eq]', habitId); //  restrict by habit
    url.searchParams.append('populate[sender]', 'true');
    url.searchParams.append('populate[receiver]', 'true');
    url.searchParams.append('sort', 'createdAt:asc');
    try {
      const res = await fetch(
        url.toString(),
         {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch messages');

      const data = await res.json();
      console.log(data)
      setMessages(data.data);
    } catch (err) {
      console.error(err);
      notifications.show({
        title: 'Error Loading Messages',
        message: err.message,
        color: 'red',
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch(`http://localhost:1337/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            sender: currentUser.id,
            receiver: partner.id,
            message: input.trim(),
            habit:habitId
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      setInput('');
      fetchMessages();
    } catch (err) {
      console.error(err);
      notifications.show({
        title: 'Error Sending Message',
        message: err.message,
        color: 'red',
      });
    }
  };

  useEffect(() => {
    if (!partner?.id || !currentUser?.id) return;

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // polling

    return () => clearInterval(interval);
  }, [partner?.id, currentUser?.id]);

  useEffect(() => {
    if (hasMounted.current) {
      //scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
     // scrollRef.current?.scrollIntoView({ behavior: 'auto' });
      hasMounted.current = true;
    }
  }, [messages]);

  return (
    <Card withBorder radius="md" mt="md">
      <Title order={6} mb="xs">
        Partner Chat
      </Title>

      <ScrollArea h={200} mb="sm" p="xs">
        <Stack spacing="xs">
          {messages.map((msg) => {
            const attr = msg;
            const senderId = attr.sender.id;
            const isMine = senderId === currentUser.id;

            return (
              <Group
                key={msg.id}
                position={isMine ? 'right' : 'left'}
                align="start"
              >
                <Text
                
                  bg={isMine ? 'blue.0' : 'gray.0'}
                  style={{
                    borderRadius: 8,
                    maxWidth: '60%',
                    whiteSpace: 'pre-wrap',
                  }}
                  p='md'
                >
                  <strong>
                    {attr.sender?.username}:
                  </strong>{' '}
                  {attr.message}
                  <Text size="xs" c="dimmed" mt={4}>
                    {dayjs(attr.createdAt).format('HH:mm')}
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


const FeedbackModal = ({ opened, onClose, habitId, partnerId }) => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(3);
  const [loading, setLoading] = useState(false);

  const currentUserId = JSON.parse(localStorage.getItem('currentUser'))?.id;
  const token = localStorage.getItem('authToken');

  const handleSubmit = async () => {
    if (!message.trim()) {
      notifications.show({
        title: 'Feedback Required',
        message: 'Please write your feedback message.',
        color: 'red',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:1337/api/feedbacks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            message,
            rating,
            habit: habitId,
            sender: currentUserId,
            receiver: partnerId,
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to submit feedback.');

      notifications.show({
        title: 'Feedback Sent',
        message: 'Your feedback was successfully submitted.',
        color: 'green',
      });

      setMessage('');
      setRating(3);
      onClose();
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Give Feedback"
      centered
      size="lg"
    >
      <Stack>
        <Textarea
          label="Your Message"
          placeholder="Write something helpful..."
          minRows={4}
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
        />

        <Rating
          value={rating}
          onChange={setRating}
          size="lg"
          count={5}
          fractions={1}
          label="Rating"
        />

        <Button
          onClick={handleSubmit}
          loading={loading}
        >
          Submit Feedback
        </Button>
      </Stack>
    </Modal>
  );
};
const MyNotifictions =  () => {

 const [notifications, setNotifications] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  const fetchNotifications = async () => {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`http://localhost:1337/api/notifications?filters[user][id][$eq]=${currentUser.id}&sort=createdAt:desc`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setNotifications(data.data);
    setUnreadCount(data.data.filter(n => !n.attributes.read).length);
  };

  fetchNotifications();
}, []);

const markAsRead = async (id) => {
  await fetch(`http://localhost:1337/api/notifications/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: JSON.stringify({ data: { read: true } }),
  });

  // Refresh list
  setNotifications((prev) =>
    prev.map((n) => (n.id === id ? { ...n, attributes: { ...n.attributes, read: true } } : n))
  );
  setUnreadCount((count) => count - 1);
};


return(
  <Menu shadow="md" width={300}>
  <Menu.Target>
    <Indicator label={unreadCount} color="red" size={16} offset={3} disabled={unreadCount === 0}>
      <ActionIcon size="lg" variant="subtle" aria-label="Notifications">
        <IconBell />
      </ActionIcon>
    </Indicator>
  </Menu.Target>

  <Menu.Dropdown>
    {notifications.length === 0 ? (
      <Menu.Item disabled>No notifications</Menu.Item>
    ) : (
      notifications.slice(0, 5).map((notif) => (
        <Menu.Item
          key={notif.id}
          onClick={() => markAsRead(notif.documentId)}
        >
          <Text fw={500}>{notif.attributes.title}</Text>
          <Text size="xs" color="dimmed">{notif.attributes.message}</Text>
        </Menu.Item>
      ))
    )}
  </Menu.Dropdown>
</Menu>
)

 }




export { HabitInfoCard,MyNotifictions, FeedbackModal, PartnerInfoCard, CheckInViewerModal,MissedCheckinBadge, WeeklyCheckinChart, PartnerChatBox};
