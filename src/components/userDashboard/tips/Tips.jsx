import React, { useState, useEffect } from "react";

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

  Image
} from "@mantine/core";
import useTip from "./tipsutil";
import stickyQuotesImg from '../../../assets/stiky-quotes.jpg';


const Tips = () => {
  const { tips, loading, error, fetchtip } = useTip();
  const [tipIndex, setTipIndex] = useState(0);


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


  const fetchNextTip = () => {
    if (tips.length === 0) return;
    setTipIndex((prev) => (prev + 1 >= tips.length ? 0 : prev + 1));
  };

  const fetchPrevTip = () => {
    if (tips.length === 0) return;
    setTipIndex((prev) => (prev - 1 < 0 ? tips.length - 1 : prev - 1));
  };


  useEffect(() => {
    fetchAdminTips();
    fetchResources();

  }, []);


 
          </Stack>
        </Box>
        {/* Right: Sticky Quotes Image */}
        <Card shadow="xl" p={0} radius={24} style={{ minWidth: 320, maxWidth: 400, flex: '0 0 370px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(120deg, #fffaf3 0%, #ffe0b2 100%)', border: '2.5px solid #ffe0b2', boxShadow: '0 8px 32px 0 rgba(255,146,43,0.15)' }}>
          <Image src={stickyQuotesImg} alt="Sticky Quotes" radius={24} fit="cover" w={350} h={350} style={{ objectFit: 'cover', borderRadius: 24 }} />
        </Card>
      </Box>


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

      </Stack>

    </Container>
  );
};

export default Tips;
