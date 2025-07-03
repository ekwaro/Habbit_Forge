import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:1337/api/habits";

const useStrapiHabits = (authToken) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };

  // Fetch habits
  const fetchHabits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { headers });
      const data = await res.json();
      console.log(data.data)
      const habits = Array.isArray(data.data)
      ? data.data.map((habit) => ({
          id: habit.id,
          ...habit.attributes,
        }))
      : [];

    setList(data.data);
      
    } catch (error) {
      console.error("Error fetching habits", error);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchHabits();
    console.log(list)
  }, [fetchHabits]);

  console.log(list)

  // Add habit
  const addItem = async (item) => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ data: item }),
      });
      await fetchHabits();
    } catch (error) {
      console.error("Error adding habit", error);
    }
  };

  // Update habit
  const updateItem = async (id, updatedData) => {

    const formateddata = {
      title:updatedData.title,
      description:updatedData.description,
      frequency:updatedData.frequency,
      startDate:updatedData.startDate,
      endDate: updatedData.endDate,
      partnerId:updatedData.partnerId

    }
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ data: formateddata }),
      });
      await fetchHabits();
    } catch (error) {
      console.error("Error updating habit", error);
    }
  };

  // Delete habit
  const removeItem = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers,
      });
      await fetchHabits();
    } catch (error) {
      console.error("Error deleting habit", error);
    }
  };

  // Clear all habits
  const clearList = async () => {
    try {
      const deletePromises = list.map((habit) =>
        fetch(`${API_URL}/${habit.id}`, {
          method: "DELETE",
          headers,
        })
      );
      await Promise.all(deletePromises);
      await fetchHabits();
    } catch (error) {
      console.error("Error clearing habits", error);
    }
  };

  return {
    list,
    loading,
    addItem,
    updateItem,
    removeItem,
    clearList,
  };
};

export default useStrapiHabits;
