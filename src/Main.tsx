import { useEffect, useMemo, useState } from "react";
import type { Habit, TodaySandwich, DaySandwich } from "./types";
import CreatePopup from "./CreatePopup";
import Clock from "./Clock";
import SandwichStack from "./SandwichStack";

const Main = () => {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "dummy",
      title: "dummy data",
      ingredient: "cheese",
    },
  ]);
  // ===========================================================================
  // sandwich history
  // ===========================================================================
  const [sandwichHistory, setSandwichHistory] = useState<DaySandwich[]>([]);
  // ===========================================================================
  // 오늘의 샌드위치 생성
  // ===========================================================================
  const [todaySandwich, setTodaySandwich] = useState<TodaySandwich>({
    date: "2026-01-01",
    habits: habits.map((v) => ({
      habitId: v.id,
      ingredient: v.ingredient,
      completed: false,
    })),
  });
  // ===========================================================================
  //
  // ===========================================================================
  const [todayDate, setTodayDate] = useState(
    new Date().toLocaleDateString("sv-SE")
  );

  useEffect(() => {
    const checkDate = () => {
      const nextDate = new Date().toLocaleDateString("sv-SE");
      setTodayDate((prevDate) => (prevDate === nextDate ? prevDate : nextDate));
      if (todaySandwich.date === nextDate) return;
      setSandwichHistory((prev) => [...prev, todaySandwich]);
      setTodaySandwich({
        date: nextDate,
        habits: habits.map((v) => ({
          habitId: v.id,
          ingredient: v.ingredient,
          completed: false,
        })),
      });
    };
    const timeoutId = setTimeout(checkDate, 0);
    const id = setInterval(checkDate, 60 * 1000);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(id);
    };
  }, [habits, todaySandwich]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // ===========================================================================
  //  onCreateHabit 새로운 습관 생성
  // ===========================================================================
  const onCreateHabit = (title: string, ingredient: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      title,
      ingredient,
    };
    setHabits((prev) => [...prev, newHabit]);
    setTodaySandwich((prev) => ({
      ...prev,
      habits: [
        ...prev.habits,
        {
          habitId: newHabit.id,
          ingredient: newHabit.ingredient,
          completed: false,
        },
      ],
    }));
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
    setTodaySandwich((prev) => ({
      ...prev,
      habits: prev.habits.map((habit) =>
        habit.habitId === id ? { ...habit, completed: !habit.completed } : habit
      ),
    }));
  };

  return (
    <div>
      <Clock></Clock>
      <h2>Today's Sandwich 🥪</h2>

      <SandwichStack todaySandwich={todaySandwich}></SandwichStack>
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
