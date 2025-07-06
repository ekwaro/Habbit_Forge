import React, { useState } from "react";

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
} from "@mantine/core";
import useTip from "./tipsutil";
const Tips = () => {
  const { tips, loading, error, fetchtip } = useTip();
  const [tipIndex, setTipIndex] = useState(0);
  const fetchNextTip = () => {
    if (tips.length === 0) return;
    setTipIndex((prev) => (prev + 1 >= tips.length ? 0 : prev + 1));
  };

  const fetchPrevTip = () => {
    if (tips.length === 0) return;
    setTipIndex((prevIndex) =>
      prevIndex-1<0?0:prevIndex-1 <tips.length?prevIndex-1:0
    );
  };


  if (tips) {
    console.log(tips);
  }
  return (
    <Container size="sm" py="xl">
      <Stack align="center" spacing="md">
        <Title order={2}>Daily Tip</Title>
        {loading ? (
          <Center>
            <Loader />
          </Center>
        ) : error ? (
          <Text c="red">{error}</Text>
        ) : (
          <Card shadow="md" padding="lg" radius="md" withBorder>
            {tips?.length > 0 ? (
              <>
               <Text>{tips[tipIndex]?.text}</Text>
                <Text size="sm" align="right" c="dimmed">
                         — {tips[tipIndex]?.category || "Unknown"}
                      </Text>
              <Group justify="left" align="center" p="xl" mt="xl">
                  <Button onClick={fetchPrevTip}  variant="light">
                    Previous Tip
                  </Button>
                  <Button onClick={fetchNextTip}  variant="light">
                    Get New Tip
                  </Button>
                </Group>
              </>
             
            ) : (
              <>
                <Text color="dimmed">No tips available.</Text>
                
              </>
            )}
          </Card>
        )}
      </Stack>
    </Container>
  );
};

export default Tips;
