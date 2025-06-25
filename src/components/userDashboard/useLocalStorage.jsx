import { useState, useEffect } from "react";

const useLocalStorage = (key, initialValue = []) => {
  const [list, setList] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      const parsedValue = JSON.parse(storedValue);
      return Array.isArray(parsedValue) ? parsedValue : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialValue;
    }
  });

  useEffect(() => {
    console.log(list)
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [key, list]);

  const addItem = (item) => {
    setList((prevList) => [...(Array.isArray(prevList) ? prevList : []), item]);
  };

const removeItem=(id)=>{
  const newList = list.filter((item)=>item.id !==id)
  setList(newList)
}

  const clearList = () => {
    setList([]);
  };

  const updateItem = (id, updatedHabit) => {
    const updatedList = list.map((habit) =>
    habit.id === id ? { ...habit, ...updatedHabit } : habit
  );
  setList(updatedList);
  };

  return { list, addItem, removeItem, clearList, updateItem };
};

export default useLocalStorage;
