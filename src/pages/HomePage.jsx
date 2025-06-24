import { Button, Group, Text, Title, Paper, Space, Image, Divider, Blockquote, Badge, Overlay } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconFlame, IconTarget, IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';

// Define keyframes separately
const animatedBackground = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
`;

function HomePage() {
  return (
   <div
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 40,
    paddingBottom: 40,
    background: `
      linear-gradient(135deg, #b2f2bb80 0%, #96f2d780 100%),
      url('https://static.vecteezy.com/system/resources/previews/002/995/838/original/old-new-habits-concept-free-photo.jpg')
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundBlendMode: 'overlay', // Makes gradient interact with image
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: `${animatedBackground} 20s linear infinite`,
    overflow: 'hidden'
  }}
>
      <Overlay color="#e6f4ea" opacity={0.8} zIndex={1} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '90vw',
          maxHeight: '95vh',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >

        <Paper
  style={{
    backgroundColor: 'rgba(230, 240, 230, 0.15)', // Very transparent
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    border: 'none' // Remove border if too distracting
  }}
>
        {/* <Paper
  shadow="lg"
  radius="lg"
  p="lg"
  withBorder
  style={{
    backgroundColor: 'rgba(195, 200, 168, 0.85)',
    backdropFilter: 'blur(10px)', // Only keep one instance
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden'
  }}
> */}
          {/* Header Section */}
          <div style={{ textAlign: 'center' }}>
            <Title 
              order={1} 
              align="center" 
              mb="sm" 
              style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                lineHeight: 1.2 
              }}
            >
              **SMALL STEPS. LASTING CHANGE**
            </Title>

            <Text align="center" size="md" color="dark"  mb="sm">
             <strong>Your personal path to building better habits.</strong>  
            </Text>

            <Text align="center" size="sm" color="dark" mb="md">
              <strong>Track your goals, stay consistent, and transform your daily routine.</strong>
            </Text>
          </div>

          {/* Features Button - Keep original */}
          <div style={{ 
            flex: '0 0 auto', 
            display: 'flex', 
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ position: 'relative' }}
            >
              <Button 
                component={Link} 
                to="/features"
                size="md"
                radius="xl"
                variant="gradient"
                gradient={{ from: 'black', to: 'green', deg: 105 }}
                rightIcon={<IconSparkles size={20} />}
                styles={(theme) => ({
                  root: {
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  },
                })}
              >
                Fuel growth
              </Button>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  transition: { 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }
                }}
                style={{
                  position: 'absolute',
                  top: -5,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'calc(100% + 10px)',
                  height: 'calc(100% + 10px)',
                  borderRadius: '50%',
                  border: '2px dashed rgba(12, 10, 18, 0.4)',
                  pointerEvents: 'none',
                }}
              />
            </motion.div>
          </div>

          {/* Quote Section */}
          <div style={{ flex: '0 0 auto', marginBottom: '1rem' }}>
            <Blockquote 
              color="white" 
              cite="Arigye Dorcus" 
              style={{ 
                fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                margin: '0 auto',
                maxWidth: '500px'
              }}
            >
              <strong>"Every action you take is a vote for the type of person you wish to become."</strong>
            </Blockquote>
          </div>

          {/* Features Button */}
          <div style={{ 
            flex: '0 0 auto', 
            display: 'flex', 
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ position: 'relative' }}
            >
              <Button 
                component={Link} 
                to="/features"
                size="md"
                radius="xl"
                variant="gradient"
                gradient={{ from: 'black', to: 'green', deg: 105 }}
                rightIcon={<IconSparkles size={16} />}
                styles={(theme) => ({
                  root: {
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  },
                })}
              >
                keep focused
              </Button>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  transition: { 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }
                }}
                style={{
                  position: 'absolute',
                  top: -5,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'calc(100% + 10px)',
                  height: 'calc(100% + 10px)',
                  borderRadius: '100%',
                  border: '2px dashed rgba(12, 13, 21, 0.4)',
                  pointerEvents: 'none',
                }}
              />
            </motion.div>
          </div>

          {/* Badges Section */}
          <div style={{ 
            flex: '0 0 auto', 
            display: 'flex', 
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <Group 
              position="center" 
              spacing="xs"
              style={{
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              <Badge 
                color="black" 
                size="sm" 
                variant="filled" 
                leftSection={<IconSparkles size={12} />}
                style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)' }}
              >
                Build Habits
              </Badge>
              <Badge 
                color="black" 
                size="sm" 
                variant="filled"
                style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)' }}
              >
                Stay Consistent
              </Badge>
              <Badge 
                color="black" 
                size="sm" 
                variant="filled"
                style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)' }}
              >
                Reach Goals
              </Badge>
            </Group>
          </div>

          <Divider mb="md" />

          {/* Login/Signup Buttons - Large and at the bottom */}
          <div style={{ 
            flex: '0 0 auto',
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <Button 
              component={Link} 
              to="/login" 
              size="xl" 
              variant="dark" 
              color="white" 
              leftIcon={<IconTarget size={20} />}
              style={{
                minWidth: '140px',
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                padding: '0.75rem 2rem'
              }}
            >
              Login
            </Button>
            <Button 
              component={Link} 
              to="/signup" 
              size="xl" 
              color="teal" 
              leftIcon={<IconFlame size={20} />}
              style={{
                minWidth: '140px',
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                padding: '0.75rem 2rem'
              }}
            >
              Sign Up
            </Button>
          </div>
        </Paper>
      </motion.div>
    </div>
  );
}

export default HomePage;