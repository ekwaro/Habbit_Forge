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
  Divider,
  Alert,
} from "@mantine/core";
import { IconRefresh, IconAlertCircle } from "@tabler/icons-react";
import { QuoteList, ResourceList } from "./QuotesList";

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
      setError(null);
      const res = await fetch(`${API_URL}/api/quotes?populate=*`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch quotes. Check permissions or token.");
      }

      const data = await res.json();
      setQuotes(data.data);
      setQuoteIndex(0);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setQuotes([]);
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

  const currentQuote = quotes[quoteIndex];
  console.log(currentQuote)

  return (
    <Paper shadow="md" p="lg" radius="lg" withBorder mt="xl">
      <Title order={2} mb="md" align='center'>
        Daily Motivation
      </Title>

      {loading ? (
        <Center>
          <Loader color="teal" />
        </Center>
      ) : error ? (
        <Alert
          icon={<IconAlertCircle size={18} />}
          title="Error!"
          color="red"
          mb="md"
        >
          {error}
          <Button mt="sm" onClick={fetchQuote}>
            Retry
          </Button>
        </Alert>
      ) : quotes.length === 0 ? (
        <Text color="dimmed" align="center">
          No quotes available.
        </Text>
      ) : (
        <Box>
          <QuoteCard quote={currentQuote} />

          <Group mt="sm" justify='space-evenly'>
            <Button variant="light" size="xs" onClick={displayPreviousQuote}>
              Previous
            </Button>
            
            <Button
              variant="light"
              size="xs"
              onClick={fetchQuote}
              leftSection={<IconRefresh size={16} />}
            >
              Refresh
            </Button>
            <Button variant="light" size="xs" onClick={displayNextQuote}>
              Next
            </Button>
          </Group>
        </Box>
      )}

      <Divider my="xl" label='admin picks' c='dimmed'/>

      <Section title="">
        <QuoteList quotes={adminQuotes} />
      </Section>

      <Divider m='lg' label='more helpfull resources'/>

      <Section title="">
        <ResourceList resources={resources} />
      </Section>
    </Paper>
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
