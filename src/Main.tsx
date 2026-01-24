import React, { useState } from "react";
import type { Habit } from "./types";
import CreatePopup from "./CreatePopup";

const Main = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: "dummy", title: "dummy data", ingredient: "cheese", isDone: false },
  ]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const onCreateHabit = (title: string, ingredient: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      title,
      ingredient,
      isDone: false,
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const onClick = () => {
    setIsCreateOpen(!isCreateOpen);
  };
  const onClosePopup = () => {
    setIsCreateOpen(false);
  };
  return (
    <div>
      <h2>My habits</h2>
      <button onClick={onClick}>Create new habit</button>
      {isCreateOpen ? (
        <CreatePopup
          onCreateHabit={onCreateHabit}
          onClosePopup={onClosePopup}
        ></CreatePopup>
      ) : null}
      <ul>
        {habits.map((habit) => {
          return (
            <li key={habit.id}>
              {habit.title} - {habit.ingredient}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Main;
