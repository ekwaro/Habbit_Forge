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
} from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";

const MotivationalQuotes = () => {
  const [quotes, setQuote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:1337/api/quotes?populate=*"
      );
      const data = await response.json();
      console.log(data);
      setQuote(data.data);
      setQuoteIndex(0);
    } catch (error) {
      console.error("Failed to fetch quote:", error);
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);
  const displayNextQuote = () => {
    if (quotes.length === 0) return;
    setQuoteIndex((prevIndex) =>
      prevIndex + 1 >= quotes.length ? 0 : prevIndex + 1
    );
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
    <Paper shadow="md" p="lg" radius="md" withBorder mt="md">
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
  );
};

export default MotivationalQuotes;
