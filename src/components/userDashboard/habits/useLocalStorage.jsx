import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
const API_URL = "http://localhost:1337/api/habits";
const authToken = import.meta.env.VITE_STRAPI_AUTH_TOKEN;

const useStrapiHabits = (token) => {
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
      console.log(data.data);
      setList(data.data);
    } catch (error) {
      console.error("Error fetching habits", error);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchHabits();
    console.log(list);
  }, [fetchHabits]);

  console.log(list);

  // Add habit
  const addItem = async (item) => {
    console.log(JSON.parse(localStorage.getItem("currentUser")));
    console.log(item);
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
    console.log(typeof id);

    const formateddata = {
      title: updatedData.title,
      description: updatedData.description,
      frequency: updatedData.frequency,
      startDate: updatedData.startDate,
      endDate: updatedData.endDate,
      completed: [],
      //partnerId:updatedData.partnerId
    };
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

  const removeItem = async (id) => {
    console.log("executed");
    console.log(`${API_URL}/${id}`);
    console.log(headers);
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers,
      });
      await fetchHabits();
    } catch (error) {
      console.error("Error deleting habit", error);
    }
  };
  const toggleHabbitCompletion = async (habitId) => {
    try {
      //get currennt habbit
      const res = await fetch(`http://localhost:1337/api/habits/${habitId}`);
      const habit = await res.json();
      const existingDates = habit?.data?.attributes?.completedDates || [];
      // Get today's date
      const today = dayjs().format("YYYY-MM-DD");
      // Prevent duplicates
      const isCompletedToday = existingDates.includes(today);

      const updatedDates = isCompletedToday
        ? existingDates.filter((date) => date !== today)
        : [...existingDates, today];
        console.log(updatedDates)
      const response = await fetch(`http://localhost:1337/api/habits/${habitId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          data: {
            completedDates: updatedDates,
          },
        }),
      });
      if(!response.ok){
        console.log(response.error)
      }
      await fetchHabits();
    } catch (error) {
      console.error("Error updating progress", error);
    }
  };
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
    toggleHabbitCompletion
  };
};

export default useStrapiHabits;
