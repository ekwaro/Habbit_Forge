import { useEffect, useState } from "react";
import {
  Paper,
  Text,
  Title,
  Loader,
  Center,
  Stack,
  Button,
  Group,
  Box,

  Image,
  Card
} from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import freshStartImg from '../../../assets/fresh-start.jpg';



const MotivationalQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [error, setError] = useState(null);
  const [adminQuotes, setAdminQuotes] = useState([]);
  const [resources, setResources] = useState([]);

  const API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:1337";

  const fetchQuote = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:1337/api/quotes?populate=*"
      );
      const data = await response.json();
      setQuote(data.data);
      setQuoteIndex(0);
    } catch (error) {
      setQuote(null);

    } finally {
      setLoading(false);
    }
  };

  const fetchAdminQuotes = async () => {
    const res = await fetch(`${API_URL}/api/motivational-quotes?populate=*`,{ method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        }});
    const json = await res.json();
    setAdminQuotes(json.data);
  };

  const fetchResources = async () => {
    const res = await fetch(`${API_URL}/api/quote-resources`,{ method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        }});
    const json = await res.json();
    setResources(json.data);
  };

  useEffect(() => {
    fetchQuote();
    fetchAdminQuotes();
    fetchResources();
  }, []);

  const displayNextQuote = () => {
    if (quotes.length === 0) return;
    setQuoteIndex((prev) => (prev + 1 >= quotes.length ? 0 : prev + 1));
  };

  const displayPreviousQuote = () => {
    setQuoteIndex((prev) => (prev - 1 < 0 ? quotes.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <Center mt="md">
        <Loader color="teal" />
      </Center>
    );
  }

  if (!quotes || quotes.length === 0) {
    return (
      <Center mt="md">
        <Text color="red">No quotes available.</Text>
        <Button onClick={fetchQuote} mt="sm">
          Try Again
        </Button>
      </Center>
    );
  }
  const current = quotes[quoteIndex];

  return (
    <Box style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'space-between', maxWidth: 1100, margin: '40px auto' }}>
      {/* Left: Quote Card */}
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Paper shadow="md" p="xl" radius="lg" withBorder mt="md" style={{ minWidth: 340, fontSize: '1.15rem' }}>
          <Stack spacing="sm">
            <Text size="lg" italic>
              “{current?.text}”
            </Text>
            <Text size="sm" align="right" c="dimmed">
              — {current?.author || "Unknown"}
            </Text>
            <Group position="apart">
              <Button size="xs" variant="light" onClick={displayPreviousQuote}>
                Previous
              </Button>
              <Button size="xs" variant="light" onClick={displayNextQuote}>
                Next Quote
              </Button>
              <Button
                size="xs"
                variant="light"
                onClick={fetchQuote}
                leftSection={<IconRefresh size={14} />}
              >
                Refresh All
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Box>
      {/* Right: Large Image Card */}
      <Card shadow="xl" p={0} radius={24} style={{ minWidth: 320, maxWidth: 400, flex: '0 0 370px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(120deg, #fffaf3 0%, #ffe5c0 100%)', border: '2.5px solid #ffe0b2', boxShadow: '0 8px 32px 0 rgba(255,146,43,0.15)' }}>
        <Image src={freshStartImg} alt="Fresh Start" radius={24} fit="cover" w={350} h={350} style={{ objectFit: 'cover', borderRadius: 24 }} />
      </Card>
    </Box>


  );
};

const QuoteCard = ({ quote }) => (
  <Stack spacing="xs" mb="md">
    <Text size="lg" fw={500} italic align='center'>
      “{quote?.text}”
    </Text>
    <Text size="sm" align="right" c="dimmed">
      — {quote?.author || "Unknown"}
    </Text>
  </Stack>
);

const Section = ({ title, children }) => (
  <Box my="lg">
    <Title order={3} mb="sm" align='center'>
      {title}
    </Title>
    {children}
  </Box>
);

export default MotivationalQuotes;
