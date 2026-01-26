import { useState } from "react";
import type { Habit } from "./types";
import CreatePopup from "./CreatePopup";
import Counter from "./Counter";

const Main = () => {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "dummy",
      title: "dummy data",
      ingredient: "cheese",
      isDone: true,
      completedDate: "2025-01-24",
    },
  ]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // ===========================================================================
  //  onCreateHabit 새로운 습관 생성
  // ===========================================================================
  const onCreateHabit = (title: string, ingredient: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      title,
      ingredient,
      isDone: false,
      completedDate: null,
    };
    setHabits((prev) => [...prev, newHabit]);
  };
  // =============================================================================
  //  popup manage
  // =============================================================================
  const onClickToCreate = () => {
    setIsCreateOpen(!isCreateOpen);
  };
  const onClosePopup = () => {
    setIsCreateOpen(false);
  };
  // ===========================================================================
  //  onChangeDone 완료 토글
  // ===========================================================================
  const onToggleDone = (id: string) => {
    const today = new Date().toLocaleDateString("sv-SE");
    setHabits((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        return {
          ...v,
          isDone: !v.isDone,
          completedDate: v.completedDate ? null : today,
        };
      })
    );
  };
  // ===========================================================================
  // count 하기

  // ===========================================================================
  return (
    <div>
      <h2>My habits</h2>
      <Counter habits={habits}></Counter>
      <button onClick={onClickToCreate}>Create new habit</button>
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
              <button
                key={habit.id}
                onClick={() => {
                  onToggleDone(habit.id);
                }}
              >
                done
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Main;
