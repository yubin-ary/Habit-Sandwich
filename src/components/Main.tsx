import { useEffect, useMemo, useState } from "react";
import type { Habit, TodaySandwich, DaySandwich } from "../types/types";
import CreatePopup from "./CreatePopup";
import Clock from "./Clock";
import SandwichStack from "./SandwichStack";
import Weather from "./Weather";
import styles from "../styles/Main.module.css";
const TODAY_SANDWICH_KEY = "todaySandwich";

const getTodayDate = () => new Date().toLocaleDateString("sv-SE");

const buildTodaySandwich = (
  date: string,
  habits: Habit[],
  existing?: TodaySandwich
): TodaySandwich => {
  return {
    date,
    habits: habits.map((v) => {
      const prev = existing?.habits.find((h) => h.habitId === v.id);
      return {
        habitId: v.id,
        habitTitle: v.title,
        ingredient: v.ingredient,
        completed: prev?.completed ?? false,
      };
    }),
  };
};

const Main = () => {
  const [habits, setHabits] = useState<Habit[]>(
    JSON.parse(localStorage.getItem("habits") ?? "[]")
  );
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  // ===========================================================================
  // sandwich history
  // ===========================================================================
  const [sandwichHistory, setSandwichHistory] = useState<DaySandwich[]>(
    JSON.parse(localStorage.getItem("history") ?? "[]")
  );
  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(sandwichHistory));
  }, [sandwichHistory]);
  // ===========================================================================
  // 오늘의 샌드위치 생성
  // ===========================================================================
  const [todaySandwich, setTodaySandwich] = useState<TodaySandwich>(() => {
    const today = getTodayDate();
    const storedRaw = localStorage.getItem(TODAY_SANDWICH_KEY);
    if (storedRaw) {
      try {
        const stored = JSON.parse(storedRaw) as TodaySandwich;
        if (stored?.date === today) {
          return buildTodaySandwich(today, habits, stored);
        }
      } catch {}
    }
    return buildTodaySandwich(today, habits);
  });
  const daySandwich = useMemo<DaySandwich>(() => {
    const completedCount = todaySandwich.habits.filter(
      (v) => v.completed
    ).length;
    return {
      ...todaySandwich,
      perfect:
        todaySandwich.habits.length > 0 &&
        completedCount === todaySandwich.habits.length,
    };
  }, [todaySandwich]);
  // ===========================================================================
  // 날짜감지
  // ===========================================================================
  const [todayDate, setTodayDate] = useState(getTodayDate());
  useEffect(() => {
    localStorage.setItem(TODAY_SANDWICH_KEY, JSON.stringify(todaySandwich));
  }, [todaySandwich]);

  useEffect(() => {
    const checkDate = () => {
      const nextDate = getTodayDate();
      setTodayDate((prevDate) => (prevDate === nextDate ? prevDate : nextDate));
      if (todaySandwich.date === nextDate) return;

      // 어제 todaySandwich를 sandwichHistory에 저장하고
      // 새로운 todaySandwich를 생성
      setTodaySandwich((prevToday) => {
        const completedCount = prevToday.habits.filter(
          (v) => v.completed
        ).length;
        const prevDay: DaySandwich = {
          ...prevToday,
          perfect:
            prevToday.habits.length > 0 &&
            completedCount === prevToday.habits.length,
        };
        setSandwichHistory((prev) => [...prev, prevDay]);

        return buildTodaySandwich(nextDate, habits);
      });
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        checkDate();
      }
    };
    const onFocus = () => {
      checkDate();
    };
    const timeoutId = setTimeout(checkDate, 0);
    const id = setInterval(checkDate, 60 * 1000);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [daySandwich, habits, todaySandwich]);

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
  // ===========================================================================
  //  날씨
  // ===========================================================================
  const [weather, setWeather] = useState("");
  return (
    <div className={styles.container}>
      <Clock></Clock>

      <h2 className={styles.title}>
        {localStorage.getItem("name")}'s Sandwich 🥪
      </h2>

      <SandwichStack
        todaySandwich={todaySandwich}
        isPerfect={daySandwich.perfect}
      ></SandwichStack>
      <button onClick={onClickToCreate}>Create new habit</button>
      {isCreateOpen ? (
        <CreatePopup
          onCreateHabit={onCreateHabit}
          onClosePopup={onClosePopup}
        ></CreatePopup>
      ) : null}
      <ul className={styles.list}>
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
                {todaySandwich.habits.find((v) => v.habitId == habit.id)
                  .completed
                  ? "■"
                  : "□"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Main;
