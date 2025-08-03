import {
  Card,
  Text,
  Title,
  Rating,
  Stack,
  Group,
  ScrollArea,
  Badge,
  Loader,
  Center,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const FeedbackList = ({ habitId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('authToken');

  const fetchFeedbacks = async () => {
    if (!habitId) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:1337/api/feedbacks?filters[habit][id][$eq]=${habitId}&populate[sender]=true&sort=createdAt:desc`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
   
      setFeedbacks(data.data);
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [habitId]);
  console.log(feedbacks)

  if (loading) {
    return (
      <Center my="xl">
        <Loader />
      </Center>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <Text color="dimmed" align="center" mt="md">
        No feedback has been given for this habit yet.
      </Text>
    );
  }

  return (
    <Card withBorder radius="md" mt="lg">
      <Title order={5} mb="md">
        Feedback Received
      </Title>
      <ScrollArea h={300}>
        <Stack spacing="md">
          {feedbacks.map((fb) => {
            const { message, rating, createdAt } = fb;
            const sender = fb.sender
            console.log(sender)

            return (
              <Card key={fb.id} shadow="sm" p="md" radius="md" withBorder>
                <Group position="apart" mb={4}>
                  <Text fw={500}>
                    {sender?.username || 'Unknown User'}
                  </Text>
                  <Badge variant="light">
                    {dayjs(createdAt).format('MMM D, YYYY HH:mm')}
                  </Badge>
                </Group>

                <Rating value={rating} readOnly size="sm" mb={6} />

                <Text size="sm" c="dimmed" style={{ whiteSpace: 'pre-wrap' }}>
                  {message}
                </Text>
              </Card>
            );
          })}
        </Stack>
      </ScrollArea>
    </Card>
  );
};

export default FeedbackList;
