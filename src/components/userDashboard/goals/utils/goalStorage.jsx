import { useEffect, useState } from "react";



const useLocalStorageGoals = () => {

    const [goals, setGoals] = useState();
    //
    useEffect(() => {
        const storedGoals = localStorage.getItem("goals");
        if (storedGoals) {
            setGoals(JSON.parse(storedGoals));
        }
    }, []);

    useEffect(() => {
        if (goals) {
            localStorage.setItem("goals", JSON.stringify(goals));
        }
    }, [goals]);

    const removeGoals=()=>{
        setGoals(localStorage.removeItem('goals'))
    }

    const addGoals = (goals) => {
        const newGoals= {
            ...goals,
            id: Date.now(),
            subgoals: [],
            notes: [],
            completed: false
        }
        setGoals((prevGoals) => {
            const updatedGoals = Array.isArray(prevGoals) ? [...prevGoals, newGoals] : [newGoals];
            localStorage.setItem("goals", JSON.stringify(updatedGoals));
            return updatedGoals;
        });
    }
  const addSubgoal = (goalId, subgoalTitle) => {
    setGoals((prevGoals) => {
      const updatedGoals = prevGoals.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            subgoals: [...goal.subgoal, {id: Date.now(), title: subgoalTitle, completed: false }],
          };
        }
        return goal;
      });
      localStorage.setItem("goals", JSON.stringify(updatedGoals));
      return updatedGoals;
    });
  }

  const addNote = (goalId, note) => {
    setGoals((prevGoals) => {
      const updatedGoals = prevGoals.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            notes: [...goal.notes, {id: Date.now(), createdAt: new Date().toISOString(),content: note }],
          };
        }
        return goal;
      });
      localStorage.setItem("goals", JSON.stringify(updatedGoals));
      return updatedGoals;
    });
  }
  const markGoalAsComplete = (goalId) => {
    setGoals((prevGoals) => {
      const updatedGoals = prevGoals.map((goal) => {
        if (goal.id === goalId) {
          return { ...goal, completed: !goal.completed };
        }
        return goal;
      });
      localStorage.setItem("goals", JSON.stringify(updatedGoals));
      return updatedGoals;
    });
  }
  const toggleSubgoalCompletion = (goalId, subgoalId) => {
    setGoals((prevGoals) => {
      const updatedGoals = prevGoals.map((goal) => {
        if (goal.id === goalId) {
          return {
            ...goal,
            subgoals: goal.subgoals.map((subgoal) =>
              subgoal.id === subgoalId ? { ...subgoal, completed: !subgoal.completed } : subgoal
            ),
          };
        }
        return goal;
      });
      localStorage.setItem("goals", JSON.stringify(updatedGoals));
      return updatedGoals;
    });
  }
  return { addGoals, goals, addSubgoal,removeGoals,toggleSubgoalCompletion, addNote, markGoalAsComplete };
}

export default useLocalStorageGoals;
// This custom hook manages the goals state and local storage for a user dashboard.