import React, { useState, useEffect } from "react";
<<<<<<< HEAD

=======
>>>>>>> 6fc339b (add notifications)
import {
  Card,
  Center,
  Container,
  Text,
  Loader,
  Stack,
  Title,
  Button,
  Group,
  Box,
  Divider,
} from "@mantine/core";
import useTip from "./tipsutil";


const TipCard = ({ tip }) => (
  <Card withBorder radius="md" p="md" shadow="xs">
    <Text>{tip?.text}</Text>
    <Text size="sm" align="right" c="dimmed" mt="sm">
      — {tip?.category || "Unknown"}
    </Text>
  </Card>
);


const ResourceCard = ({ resource }) => (
  <Card withBorder radius="md" p="md" shadow="xs">
    <Text fw={500}>{resource?.title}</Text>
    <Text size="sm" c="dimmed" mt="xs">
      {resource?.description}
    </Text>
    <Text size="xs" mt="xs">
      <a href={resource?.link} target="_blank" rel="noopener noreferrer">
        Visit Resource
      </a>
    </Text>
  </Card>
);

const Tips = () => {
  const { tips, loading, error, fetchtip } = useTip();
  const [tipIndex, setTipIndex] = useState(0);
<<<<<<< HEAD
  
  // Debug logging
  console.log('Tips component rendered:', { tips, loading, error, tipIndex });
=======

  const [adminTips, setAdminTips] = useState([]);
  const [resources, setResources] = useState([]);

  const API_URL = import.meta.env.VITE_BASE_URL;

  const fetchAdminTips = async () => {
    const res = await fetch(`${API_URL}/tips?`);
    const json = await res.json();
    setAdminTips(json.data);
  };

  const fetchResources = async () => {
    const res = await fetch(`${API_URL}/tip-resources`);
    const json = await res.json();
    setResources(json.data);
  };

>>>>>>> 6fc339b (add notifications)
  const fetchNextTip = () => {
    if (tips.length === 0) return;
    setTipIndex((prev) => (prev + 1 >= tips.length ? 0 : prev + 1));
  };

  const fetchPrevTip = () => {
    if (tips.length === 0) return;
    setTipIndex((prev) => (prev - 1 < 0 ? tips.length - 1 : prev - 1));
  };

<<<<<<< HEAD
  // Ensure tipIndex is within bounds
  const safeTipIndex = Math.min(tipIndex, tips.length - 1);
  const currentTip = tips[safeTipIndex];

  // Reset tipIndex when tips change
  useEffect(() => {
    if (tips.length > 0 && tipIndex >= tips.length) {
      setTipIndex(0);
    }
  }, [tips, tipIndex]);
=======
  useEffect(() => {
    fetchAdminTips();
    fetchResources();

  }, []);
>>>>>>> 6fc339b (add notifications)

  return (
<<<<<<< HEAD
    <Container size="lg" py="xl">
      <Stack align="center" spacing="md">
        <Title order={2} style={{ color: '#ff922b', fontWeight: 700 }}>Daily Habit Tip</Title>
        {loading ? (
          <Center>
            <Loader size="lg" color="orange" />
            <Text mt="md" color="#666">Loading your daily tip...</Text>
          </Center>
        ) : error ? (
          <Card shadow="md" padding="lg" radius="md" withBorder style={{ background: '#fff3e0', border: '1px solid #ffd180' }}>
            <Stack align="center" spacing="md">
              <Text c="red" fw={600}>Unable to load tips</Text>
              <Text size="sm" c="#666" ta="center">{error}</Text>
              <Button onClick={fetchtip} variant="light" color="orange">
                Try Again
              </Button>
            </Stack>
          </Card>
        ) : (
          <Card shadow="md" padding="xl" radius="lg" withBorder style={{ 
            background: 'rgba(255,255,255,0.95)', 
            border: '2px solid #ffd180',
            maxWidth: 600,
            width: '100%'
          }}>
            {tips?.length > 0 ? (
              <>
                <Text size="lg" style={{ lineHeight: 1.6, color: '#333' }}>
                  {currentTip?.content}
                </Text>
                <Text size="sm" align="right" c="dimmed" mt="md">
                  — {currentTip?.category || "Habit Building"}
                </Text>
                <Group justify="center" align="center" mt="xl">
                  <Button onClick={fetchPrevTip} variant="light" color="orange">
                    Previous Tip
                  </Button>
                  <Button onClick={fetchNextTip} variant="filled" color="orange">
                    Next Tip
                  </Button>
                </Group>
                <Text size="xs" c="dimmed" ta="center" mt="md">
                  Tip {safeTipIndex + 1} of {tips.length}
                </Text>
              </>
            ) : (
              <Stack align="center" spacing="md">
                <Text color="dimmed" size="lg">No tips available at the moment.</Text>
                <Text size="sm" c="#666" ta="center">
                  Check back later for helpful habit-building tips!
                </Text>
                <Button onClick={fetchtip} variant="light" color="orange">
                  Refresh
                </Button>
              </Stack>
            )}
          </Card>
        )}
=======
    <Container size="sm" py="xl">
      <Stack spacing="xl">
        {/* --- Daily Tip Section --- */}
        <Box>
          <Title order={2} align="center">
            Daily Tip
          </Title>
          {loading ? (
            <Center mt="md">
              <Loader />
            </Center>
          ) : error ? (
            <Text color="red">{error}</Text>
          ) : tips?.length > 0 ? (
            <Card shadow="md" padding="lg" radius="md" withBorder mt="md">
              <Text>{tips[tipIndex]?.text}</Text>
              <Text size="sm" align="right" c="dimmed" mt="sm">
                — {tips[tipIndex]?.category || "Unknown"}
              </Text>
              <Group justify="space-between" mt="md">
                <Button size="xs" variant="light" onClick={fetchPrevTip}>
                  Previous
                </Button>
                <Button size="xs" variant="light" onClick={fetchNextTip}>
                  Next Tip
                </Button>
              </Group>
            </Card>
          ) : (
            <Text color="dimmed" align="center">
              No tips available.
            </Text>
          )}
        </Box>

        {/* --- Admin Tips Section --- */}
        <Box>
          <Divider c='dimmed' label='Admin tips pick'/>
          {adminTips?.length === 0 ? (
            <Text color="dimmed" align='center'>No admin tips yet.</Text>
          ) : (
            <Stack spacing="sm">
              {adminTips.map((tip) => (
                <TipCard key={tip.id} tip={tip.attributes} />
              ))}
            </Stack>
          )}
        </Box>

        {/* --- Helpful Tip Resources Section --- */}
        <Box>
           <Divider c='dimmed' label='More useful resources'/>
           {resources?.length === 0 ? (
            <Text color="dimmed" align='center'>No resources found.</Text>
          ) : (
            <Stack spacing="sm">
              {resources.map((res) => (
                <ResourceCard key={res.id} resource={res.attributes} />
              ))}
            </Stack>
          )}
        </Box>
>>>>>>> 6fc339b (add notifications)
      </Stack>
    </Container>
  );
};

export default Tips;
