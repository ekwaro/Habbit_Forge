import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  Card,
  Group,
  Badge,
  Box,
  RingProgress,
  Progress,
  ActionIcon,
  Tooltip,
  Modal,
  Textarea,
  Center,
  Loader,
  Button,
} from '@mantine/core';
import {
  IconCheck,
  IconTarget,
  IconTrophy,
  IconFlame,
  IconMoodSmile,
  IconNotes,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

const InteractiveHabits = () => {
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [reflection, setReflection] = useState('');
  const [completionAnimations, setCompletionAnimations] = useState({});
  const [loading, setLoading] = useState(true);

  const today = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    try {
      const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]');
      setHabits(storedHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHabitToggle = async (habit) => {
    const isCompleted = habit.completedDates?.includes(today);
    
    // Add completion animation
    if (!isCompleted) {
      setCompletionAnimations(prev => ({
        ...prev,
        [habit.id]: true
      }));
      
      // Trigger confetti effect
      triggerConfetti();
      
      // Show reflection modal for completed habits
      setSelectedHabit(habit);
      setShowReflectionModal(true);
    }

    // Update habit completion
    const updatedHabits = habits.map(h => {
      if (h.id === habit.id) {
        const completedDates = h.completedDates || [];
        if (isCompleted) {
          return {
            ...h,
            completedDates: completedDates.filter(date => date !== today)
          };
        } else {
          return {
            ...h,
            completedDates: [...completedDates, today]
          };
        }
      }
      return h;
    });
    
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const triggerConfetti = () => {
    // Simple confetti effect using CSS
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: ${['#ff922b', '#4caf50', '#2196f3', '#9c27b0', '#ff9800'][Math.floor(Math.random() * 5)]};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: -10px;
        animation: confetti-fall 2s linear forwards;
      `;
      confetti.appendChild(particle);
    }
    
    document.body.appendChild(confetti);
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes confetti-fall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
      document.body.removeChild(confetti);
      document.head.removeChild(style);
    }, 2000);
  };

  const getHabitProgress = (habit) => {
    if (!habit.completedDates) return 0;
    const totalDays = dayjs(habit.endDate).diff(dayjs(habit.startDate), 'day') + 1;
    const completedDays = habit.completedDates.length;
    return Math.round((completedDays / totalDays) * 100);
  };

  const getCurrentStreak = (habit) => {
    if (!habit.completedDates) return 0;
    
    let streak = 0;
    let currentDate = dayjs();
    
    while (habit.completedDates.includes(currentDate.format('YYYY-MM-DD'))) {
      streak++;
      currentDate = currentDate.subtract(1, 'day');
    }
    
    return streak;
  };

  const getHabitStatus = (habit) => {
    const isCompleted = habit.completedDates?.includes(today);
    const progress = getHabitProgress(habit);
    const streak = getCurrentStreak(habit);
    
    if (isCompleted) return { status: 'completed', color: 'green', icon: IconCheck };
    if (progress >= 80) return { status: 'excellent', color: 'blue', icon: IconTrophy };
    if (progress >= 60) return { status: 'good', color: 'orange', icon: IconTarget };
    if (streak > 0) return { status: 'streak', color: 'red', icon: IconFlame };
    return { status: 'pending', color: 'gray', icon: IconTarget };
  };

  const saveReflection = () => {
    if (selectedHabit && reflection.trim()) {
      // Save reflection to localStorage or API
      const reflections = JSON.parse(localStorage.getItem('habitReflections') || '{}');
      reflections[selectedHabit.id] = reflections[selectedHabit.id] || {};
      reflections[selectedHabit.id][today] = reflection;
      localStorage.setItem('habitReflections', JSON.stringify(reflections));
    }
    setShowReflectionModal(false);
    setReflection('');
    setSelectedHabit(null);
  };

  if (loading) {
    return (
      <Container size="lg">
        <Center style={{ height: '50vh' }}>
          <Stack align="center" spacing="md">
            <Loader size="lg" color="orange" />
            <Text size="lg" color="#666">Loading your habits...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Paper
        shadow="xl"
        radius="lg"
        p="xl"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid #ffe0b2',
          boxShadow: '0 4px 32px 0 rgba(255,146,43,0.10)',
        }}
      >
        <Title order={1} style={{ color: '#ff922b', fontWeight: 900, marginBottom: '1rem' }}>
          Interactive Habit Tracker
        </Title>
        <Text size="lg" color="#666" mb="xl">
          Track your habits with real-time feedback and engaging animations
        </Text>

        {habits.length === 0 ? (
          <Center style={{ padding: '4rem 2rem' }}>
            <Stack align="center" spacing="lg">
              <IconTarget size={64} color="#ff922b" />
              <Title order={2} style={{ color: '#ff922b', fontWeight: 700 }}>
                No Habits Yet
              </Title>
              <Text size="lg" color="#666" ta="center" maw={400}>
                Create some habits in the Habits Management section to start tracking them interactively!
              </Text>
            </Stack>
          </Center>
        ) : (
          <Stack spacing="md">
            {habits.map((habit) => {
              const { status, color, icon: StatusIcon } = getHabitStatus(habit);
              const isCompleted = habit.completedDates?.includes(today);
              const progress = getHabitProgress(habit);
              const streak = getCurrentStreak(habit);
              const isAnimating = completionAnimations[habit.id];

              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    shadow="md"
                    padding="lg"
                    radius="lg"
                    withBorder
                    style={{
                      background: isCompleted 
                        ? 'linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%)'
                        : 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                      border: `2px solid ${isCompleted ? '#4caf50' : '#ffd180'}`,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Group justify="space-between" align="flex-start">
                      <Box style={{ flex: 1 }}>
                        <Group mb="xs">
                          <Text fw={700} size="lg" style={{ color: '#222' }}>
                            {habit.title}
                          </Text>
                          <Badge color={color} variant="light" leftSection={<StatusIcon size={14} />}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                          {streak > 0 && (
                            <Badge color="red" variant="filled" leftSection={<IconFlame size={14} />}>
                              {streak} day{streak > 1 ? 's' : ''} streak
                            </Badge>
                          )}
                        </Group>
                        
                        <Text size="sm" color="#666" mb="md">
                          {habit.description || 'No description provided'}
                        </Text>

                        <Group mb="md">
                          <RingProgress
                            size={80}
                            thickness={8}
                            sections={[{ value: progress, color: isCompleted ? '#4caf50' : '#ff922b' }]}
                            label={
                              <Text ta="center" size="xs" fw={700}>
                                {progress}%
                              </Text>
                            }
                          />
                          
                          <Box style={{ flex: 1 }}>
                            <Text size="sm" fw={600} mb={4}>Progress</Text>
                            <Progress
                              value={progress}
                              color={isCompleted ? 'green' : 'orange'}
                              size="md"
                              radius="xl"
                            />
                            <Text size="xs" color="#666" mt={4}>
                              {habit.completedDates?.length || 0} of {dayjs(habit.endDate).diff(dayjs(habit.startDate), 'day') + 1} days completed
                            </Text>
                          </Box>
                        </Group>
                      </Box>

                      <Stack align="center" spacing="sm">
                        <AnimatePresence>
                          {isAnimating && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              transition={{ duration: 0.5 }}
                              style={{ position: 'absolute', zIndex: 10 }}
                            >
                              <IconCheck size={40} color="#4caf50" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <Tooltip label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}>
                          <ActionIcon
                            size="xl"
                            variant="filled"
                            color={isCompleted ? 'green' : 'orange'}
                            onClick={() => handleHabitToggle(habit)}
                            style={{
                              transition: 'all 0.2s ease',
                              transform: isAnimating ? 'scale(1.2)' : 'scale(1)',
                            }}
                          >
                            {isCompleted ? <IconCheck size={24} /> : <IconTarget size={24} />}
                          </ActionIcon>
                        </Tooltip>
                        
                        <Text size="xs" fw={600} style={{ color: isCompleted ? '#4caf50' : '#ff922b' }}>
                          {isCompleted ? 'Completed!' : 'Complete'}
                        </Text>
                      </Stack>
                    </Group>
                  </Card>
                </motion.div>
              );
            })}
          </Stack>
        )}
      </Paper>

      {/* Reflection Modal */}
      <Modal
        opened={showReflectionModal}
        onClose={() => setShowReflectionModal(false)}
        title="Great job! How did it feel?"
        size="md"
      >
        <Stack>
          <Text size="sm" color="#666">
            Take a moment to reflect on completing "{selectedHabit?.title}". 
            This helps build awareness and motivation!
          </Text>
          
          <Textarea
            placeholder="How did completing this habit make you feel? Any challenges or victories?"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            minRows={3}
            maxRows={6}
          />
          
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setShowReflectionModal(false)}>
              Skip
            </Button>
            <Button color="green" onClick={saveReflection}>
              Save Reflection
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default InteractiveHabits; 