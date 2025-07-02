import { Button, Group, Text, Title, Paper, Badge } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconFlame, IconTarget, IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';

function HomePage() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#FFF8F0', // Cream background
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Main content container */}
      <div
        style={{
          flex: 1,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '80px',
          position: 'relative',
        }}
      >
        {/* Sideways image container - shows entire image */}
        <div
          style={{
            position: 'absolute',
            right: 200,
            top: '100%',
            transform: 'translateY(-50%) rotate(90deg)',
            width: '50%', // Height becomes width when rotated
            height: '50%', // Narrow strip
            backgroundImage: 'url(https://static.vecteezy.com/system/resources/previews/002/995/838/original/old-new-habits-concept-free-photo.jpg)',
            backgroundSize: 'contain', // Show entire image
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
            opacity: 0.7,
            borderLeft: '4px solid #E67E22',
            transformOrigin: 'right center',
          }}
        />

        {/* Content with higher z-index to appear above image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 'calc(100% - 140px)', // Adjust for image strip
          }}
        >
          <Title
            order={1}
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 1.2,
              color: '#E67E22',
              fontWeight: 800,
              marginBottom: '1.5rem',
            }}
          >
            SMALL STEPS. LASTING CHANGE
          </Title>

          <Text 
            size="xl" 
            mb="md" 
            style={{ 
              color: '#333', 
              fontWeight: 600,
              maxWidth: '600px',
            }}
          >
            Your personal path to building better habits.
          </Text>

          <Text 
            size="lg" 
            mb="xl" 
            style={{ 
              color: '#555', 
              fontWeight: 500,
              maxWidth: '600px',
            }}
          >
            Track your goals, stay consistent, and transform your daily routine.
          </Text>

          <Group spacing="xl" mb="xl">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                component={Link}
                to="/features"
                size="lg"
                radius="xl"
                variant="gradient"
                gradient={{ from: 'orange', to: '#E67E22', deg: 105 }}
                rightIcon={<IconSparkles size={20} />}
                style={{
                  fontSize: '1.1rem',
                  padding: '0.75rem 2rem',
                  fontWeight: 600,
                }}
              >
                Fuel Growth
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                component={Link}
                to="/features"
                size="lg"
                radius="xl"
                variant="gradient"
                gradient={{ from: '#E67E22', to: 'orange', deg: 105 }}
                rightIcon={<IconTarget size={20} />}
                style={{
                  fontSize: '1.1rem',
                  padding: '0.75rem 2rem',
                  fontWeight: 600,
                }}
              >
                Keep Focused
              </Button>
            </motion.div>
          </Group>

          <Paper
            p="md"
            mb="xl"
            style={{
              backgroundColor: 'rgba(230, 126, 34, 0.1)',
              borderLeft: '4px solid #E67E22',
              maxWidth: '600px',
            }}
          >
            <Text
              size="lg"
              style={{
                fontStyle: 'italic',
                color: '#333',
                fontWeight: 500,
                lineHeight: 1.6,
              }}
            >
              "Every action you take is a vote for the type of person you wish to become."
              <br />
              <span style={{ fontSize: '0.9em', color: '#666' }}>- Arigye Dorcus</span>
            </Text>
          </Paper>

          <Group spacing="md" mb="xl">
            <Badge 
              color="orange" 
              size="xl" 
              variant="filled" 
              leftSection={<IconSparkles size={16} />}
              style={{ fontSize: '1rem', padding: '0.6rem 1.2rem' }}
            >
              Build Habits
            </Badge>
            <Badge 
              color="orange" 
              size="xl" 
              variant="filled"
              leftSection={<IconFlame size={16} />}
              style={{ fontSize: '1rem', padding: '0.6rem 1.2rem' }}
            >
              Stay Consistent
            </Badge>
            <Badge 
              color="orange" 
              size="xl" 
              variant="filled"
              leftSection={<IconTarget size={16} />}
              style={{ fontSize: '1rem', padding: '0.6rem 1.2rem' }}
            >
              Reach Goals
            </Badge>
          </Group>
        </motion.div>
      </div>
    </div>
  );
}

export default HomePage;