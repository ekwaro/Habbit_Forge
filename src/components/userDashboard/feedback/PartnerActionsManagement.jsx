import React, { useEffect, useState } from 'react';
import {
  Stack,
  Card,
  Button,
  Grid,
  Loader,
  Text,
  Title,
} from '@mantine/core';

import {
  PartnerInfoCard,
  HabitInfoCard,
  CheckInViewerModal,
  MissedCheckinBadge,
  WeeklyCheckinChart,
  PartnerChatBox,
  FeedbackModal
} from './Feedback';

const currentUser = JSON.parse(localStorage.getItem('currentUser'));

const PartnerActionsPage = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkInModalOpen, setCheckInModalOpen] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(null);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await fetch(
          `http://localhost:1337/api/habits?filters[accountabilityPartner][id][$eq]=${currentUser.id}&populate=accountabilityPartner`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }
        );
        const data = await res.json();
        setHabits(data?.data || []);
      } catch (err) {
        console.error('Failed to fetch habits:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  if (loading) {
    return (
      <Stack align="center" mt="xl">
        <Loader />
      </Stack>
    );
  }

  if (!habits.length) {
    return (
      <Stack align="center" mt="xl">
        <Text c='dimmed'>You have not been assigned any partner monitoring tasks.</Text>
      </Stack>
    );
  }

  return (
    <Stack spacing="md" p="md">
      {habits.map((habit) => {
        const partnerData = habit?.accountabilityPartner;
        const completedDates = habit?.completedDates || [];

        return (
          <Card withBorder radius="md" key={habit.id} shadow="sm">
            <Title order={4}>Habit #{habit.id} Partner Dashboard</Title>

            {/* Partner Info */}
            <PartnerInfoCard partner={partnerData} />

            {/* Habit Info */}
            <HabitInfoCard habit={habit} />

            {/* Missed Check-in Badge */}
            <MissedCheckinBadge completedDates={completedDates} />

            {/* Weekly Progress */}
            <WeeklyCheckinChart completedDates={completedDates} />

            {/* Actions Panel */}
            <Grid mt="md">
              <Grid.Col span={4}>
                <Button
                  variant="light"
                  fullWidth
                  onClick={() => setCheckInModalOpen(habit.id)}
                >
                  View Check-ins
                </Button>
              </Grid.Col>

              <Grid.Col span={4}>
                <Button
                  variant="light"
                  fullWidth
                  onClick={() => setFeedbackModalOpen(habit.id)}
                >
                  Give Feedback
                </Button>
              </Grid.Col>

              <Grid.Col span={4}>
                <Button variant="light" fullWidth>
                  Manage Reminders
                </Button>
              </Grid.Col>
            </Grid>

            {/* Chat Box */}
            <PartnerChatBox
              currentUser={currentUser}
              partner={partnerData}
              habitId={habit.id}
            />

            {/* Modals */}
            <CheckInViewerModal
              opened={checkInModalOpen === habit.id}
              onClose={() => setCheckInModalOpen(null)}
              completedDates={completedDates}
            />

            <FeedbackModal
              opened={feedbackModalOpen === habit.id}
              onClose={() => setFeedbackModalOpen(null)}
              habitId={habit.id}
              partnerId={partnerData?.id}
            />
          </Card>
        );
      })}
    </Stack>
  );
};

export default PartnerActionsPage;
