import React, { useState, useEffect } from 'react';
import {
  Card,
  Text,
  Group,
  Badge,
  Progress,
  Stack,
  Box,
  RingProgress,
  Button,
  Modal,
  SimpleGrid,
  Avatar,
  Divider,
  Tooltip,
} from '@mantine/core';
import {
  IconTrophy,
  IconFlame,
  IconTarget,
  IconStar,
  IconCrown,
  IconMedal,
  IconAward,
  IconZap,
  IconTrendingUp,
  IconCheck,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

const GamificationSystem = ({ habits, goals }) => {
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    totalXP: 0,
    streak: 0,
    badges: [],
    achievements: [],
  });
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newBadge, setNewBadge] = useState(null);

  // XP requirements for each level
  const xpForLevel = (level) => Math.floor(100 * Math.pow(1.5, level - 1));
  
  // Calculate current level and progress
  const calculateLevel = (totalXP) => {
    let level = 1;
    let xpNeeded = 0;
    
    while (totalXP >= xpForLevel(level)) {
      totalXP -= xpForLevel(level);
      level++;
    }
    
    return { level, currentXP: totalXP, xpNeeded: xpForLevel(level) };
  };

  // Available badges
  const availableBadges = [
    {
      id: 'first_habit',
      name: 'First Steps',
      description: 'Complete your first habit',
      icon: IconTarget,
      color: '#4caf50',
      requirement: 1,
      type: 'habits_completed'
    },
    {
      id: 'streak_7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: IconFlame,
      color: '#ff9800',
      requirement: 7,
      type: 'streak'
    },
    {
      id: 'streak_30',
      name: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      icon: IconTrophy,
      color: '#ff5722',
      requirement: 30,
      type: 'streak'
    },
    {
      id: 'streak_100',
      name: 'Century Club',
      description: 'Maintain a 100-day streak',
      icon: IconCrown,
      color: '#9c27b0',
      requirement: 100,
      type: 'streak'
    },
    {
      id: 'goal_completed',
      name: 'Goal Getter',
      description: 'Complete your first goal',
      icon: IconStar,
      color: '#2196f3',
      requirement: 1,
      type: 'goals_completed'
    },
    {
      id: 'perfect_week',
      name: 'Perfect Week',
      description: 'Complete all habits for 7 days straight',
      icon: IconCheck,
      color: '#4caf50',
      requirement: 7,
      type: 'perfect_days'
    },
    {
      id: 'habit_master',
      name: 'Habit Master',
      description: 'Complete 50 habits total',
      icon: IconMedal,
      color: '#ff922b',
      requirement: 50,
      type: 'habits_completed'
    },
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Complete 5 habits before 8 AM',
      icon: IconZap,
      color: '#ffc107',
      requirement: 5,
      type: 'early_completions'
    }
  ];

  useEffect(() => {
    calculateUserStats();
  }, [habits, goals]);

  const calculateUserStats = () => {
    // Load existing stats
    const savedStats = JSON.parse(localStorage.getItem('userGamificationStats') || '{}');
    
    // Calculate current stats
    const completedHabits = habits.filter(h => h.completedDates?.length > 0).length;
    const completedGoals = goals.filter(g => g.completed).length;
    const totalHabitCompletions = habits.reduce((sum, h) => sum + (h.completedDates?.length || 0), 0);
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date();
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasCompletedHabits = habits.some(habit => 
        habit.completedDates?.includes(dateStr)
      );
      
      if (hasCompletedHabits) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate XP
    let totalXP = savedStats.totalXP || 0;
    const newXP = (completedHabits * 10) + (completedGoals * 50) + (currentStreak * 5);
    
    if (newXP > totalXP) {
      totalXP = newXP;
    }

    const { level, currentXP, xpNeeded } = calculateLevel(totalXP);

    // Check for new badges
    const earnedBadges = checkForNewBadges({
      habits_completed: totalHabitCompletions,
      goals_completed: completedGoals,
      streak: currentStreak,
      perfect_days: calculatePerfectDays(),
      early_completions: calculateEarlyCompletions(),
    });

    const newBadges = earnedBadges.filter(badge => 
      !savedStats.badges?.some(earned => earned.id === badge.id)
    );

    if (newBadges.length > 0) {
      setNewBadge(newBadges[0]);
      setShowBadgeModal(true);
    }

    const updatedStats = {
      level,
      xp: currentXP,
      totalXP,
      xpNeeded,
      streak: currentStreak,
      badges: earnedBadges,
      achievements: savedStats.achievements || [],
    };

    setUserStats(updatedStats);
    localStorage.setItem('userGamificationStats', JSON.stringify(updatedStats));
  };

  const checkForNewBadges = (stats) => {
    return availableBadges.filter(badge => {
      const currentValue = stats[badge.type] || 0;
      return currentValue >= badge.requirement;
    });
  };

  const calculatePerfectDays = () => {
    // Count days where all scheduled habits were completed
    let perfectDays = 0;
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const scheduledHabits = habits.filter(habit => {
        const startDate = new Date(habit.startDate);
        const endDate = new Date(habit.endDate);
        return checkDate >= startDate && checkDate <= endDate;
      });
      
      if (scheduledHabits.length > 0) {
        const completedHabits = scheduledHabits.filter(habit => 
          habit.completedDates?.includes(dateStr)
        );
        
        if (completedHabits.length === scheduledHabits.length) {
          perfectDays++;
        }
      }
    }
    
    return perfectDays;
  };

  const calculateEarlyCompletions = () => {
    // This would need to be tracked when habits are completed
    // For now, return a mock value
    return Math.floor(Math.random() * 3);
  };

  const getLevelRewards = (level) => {
    const rewards = {
      5: 'Unlock habit categories',
      10: 'Custom theme colors',
      15: 'Advanced analytics',
      20: 'Priority support',
      25: 'Exclusive content',
    };
    return rewards[level] || null;
  };

  return (
    <>
      <Stack spacing="lg">
        {/* Level and XP Card */}
        <Card shadow="md" padding="lg" radius="lg" withBorder>
          <Group justify="space-between" mb="md">
            <Text fw={700} size="lg" style={{ color: '#ff922b' }}>
              Your Progress
            </Text>
            <Badge color="orange" variant="light" leftSection={<IconTrendingUp size={14} />}>
              Level {userStats.level}
            </Badge>
          </Group>

          <Group align="flex-start">
            <RingProgress
              size={120}
              thickness={12}
              sections={[{ 
                value: (userStats.xp / userStats.xpNeeded) * 100, 
                color: '#ff922b' 
              }]}
              label={
                <Text ta="center" size="lg" fw={700} style={{ color: '#ff922b' }}>
                  {userStats.level}
                </Text>
              }
            />

            <Stack style={{ flex: 1 }}>
              <Text fw={600} size="md">Experience Points</Text>
              <Text size="xl" fw={800} style={{ color: '#ff922b' }}>
                {userStats.xp} / {userStats.xpNeeded} XP
              </Text>
              <Progress
                value={(userStats.xp / userStats.xpNeeded) * 100}
                color="orange"
                size="md"
                radius="xl"
              />
              <Text size="sm" color="#666">
                Total XP: {userStats.totalXP}
              </Text>
              
              {getLevelRewards(userStats.level) && (
                <Badge color="green" variant="light" size="sm">
                  🎁 {getLevelRewards(userStats.level)}
                </Badge>
              )}
            </Stack>
          </Group>
        </Card>

        {/* Streak and Badges */}
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {/* Current Streak */}
          <Card shadow="md" padding="lg" radius="lg" withBorder>
            <Group justify="space-between" mb="md">
              <Text fw={600} size="md">Current Streak</Text>
              <IconFlame size={24} color="#ff5722" />
            </Group>
            
            <Text size="2xl" fw={800} style={{ color: '#ff5722', textAlign: 'center' }}>
              {userStats.streak} days
            </Text>
            
            <Text size="sm" color="#666" ta="center">
              Keep the fire burning! 🔥
            </Text>
          </Card>

          {/* Badges Summary */}
          <Card 
            shadow="md" 
            padding="lg" 
            radius="lg" 
            withBorder
            style={{ cursor: 'pointer' }}
            onClick={() => setShowAchievementsModal(true)}
          >
            <Group justify="space-between" mb="md">
              <Text fw={600} size="md">Badges Earned</Text>
              <IconTrophy size={24} color="#ff922b" />
            </Group>
            
            <Text size="2xl" fw={800} style={{ color: '#ff922b', textAlign: 'center' }}>
              {userStats.badges.length}
            </Text>
            
            <Text size="sm" color="#666" ta="center">
              Click to view all achievements
            </Text>
          </Card>
        </SimpleGrid>

        {/* Recent Achievements */}
        {userStats.badges.length > 0 && (
          <Card shadow="md" padding="lg" radius="lg" withBorder>
            <Text fw={600} size="md" mb="md">Recent Achievements</Text>
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
              {userStats.badges.slice(-4).map((badge) => {
                const badgeData = availableBadges.find(b => b.id === badge.id);
                const Icon = badgeData?.icon || IconAward;
                
                return (
                  <Tooltip key={badge.id} label={badgeData?.description}>
                    <Box
                      style={{
                        textAlign: 'center',
                        padding: '1rem',
                        borderRadius: 8,
                        backgroundColor: '#f8f9fa',
                        border: `2px solid ${badgeData?.color || '#ff922b'}`,
                      }}
                    >
                      <Icon size={32} color={badgeData?.color || '#ff922b'} />
                      <Text size="xs" fw={600} mt="xs">
                        {badgeData?.name}
                      </Text>
                    </Box>
                  </Tooltip>
                );
              })}
            </SimpleGrid>
          </Card>
        )}
      </Stack>

      {/* Achievements Modal */}
      <Modal
        opened={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        title="Achievements & Badges"
        size="lg"
      >
        <Stack>
          <Text size="sm" color="#666" mb="md">
            Track your progress and unlock achievements as you build better habits!
          </Text>

          <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
            {availableBadges.map((badge) => {
              const isEarned = userStats.badges.some(b => b.id === badge.id);
              const Icon = badge.icon;
              
              return (
                <Card
                  key={badge.id}
                  shadow="sm"
                  padding="md"
                  radius="md"
                  withBorder
                  style={{
                    opacity: isEarned ? 1 : 0.6,
                    backgroundColor: isEarned ? '#f8f9fa' : '#f5f5f5',
                    border: `2px solid ${isEarned ? badge.color : '#ddd'}`,
                  }}
                >
                  <Stack align="center" spacing="xs">
                    <Icon size={32} color={isEarned ? badge.color : '#999'} />
                    <Text size="sm" fw={600} ta="center">
                      {badge.name}
                    </Text>
                    <Text size="xs" color="#666" ta="center">
                      {badge.description}
                    </Text>
                    {isEarned && (
                      <Badge color="green" variant="light" size="xs">
                        Earned
                      </Badge>
                    )}
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>
        </Stack>
      </Modal>

      {/* New Badge Modal */}
      <Modal
        opened={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
        title="🎉 New Achievement Unlocked!"
        size="sm"
        centered
      >
        {newBadge && (
          <Stack align="center" spacing="md">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: newBadge.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                }}
              >
                <newBadge.icon size={40} color="white" />
              </Box>
            </motion.div>
            
            <Text fw={700} size="lg" ta="center">
              {newBadge.name}
            </Text>
            
            <Text size="sm" color="#666" ta="center">
              {newBadge.description}
            </Text>
            
            <Button
              color="orange"
              onClick={() => setShowBadgeModal(false)}
              fullWidth
            >
              Awesome!
            </Button>
          </Stack>
        )}
      </Modal>
    </>
  );
};

export default GamificationSystem; 