import { useContext, useEffect, useMemo, useState } from "react";
import type { Habit, TodaySandwich, DaySandwich } from "../types/types";
import Clock from "../components/Clock";
import SandwichStack from "../components/SandwichStack";
import Todolist from "../components/Todolist";
import styles from "../styles/Main.module.css";
const TODAY_SANDWICH_KEY = "todaySandwich";
import bread from "../asset/bread.png";
import cheese from "../asset/cheese.png";
import ham from "../asset/ham.png";
import lettuce from "../asset/lettuce.png";
import tomato from "../asset/tomato.png";
import onion from "../asset/onion.png";
import { weatherContext } from "../components/weather/WeatherProvider";
import { WeatherBackground } from "../components/WeatherBackground";

const ingredientImageMap: Record<string, string> = {
  bread,
  cheese,
  ham,
  lettuce,
  tomato,
  onion,
};

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
  const weather = useContext(weatherContext);
  const [habits, setHabits] = useState<Habit[]>(
    JSON.parse(localStorage.getItem("habits") ?? "[]")
  );
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  // ===========================================================================
  // sandwich history - 샌드위치 히스토리가 바뀌면 로컬스토리지에 업데이트
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
        // =====================================================================
        //  오늘자 샌드위치 이미 만들어져있으면 그거 build (completed 상태 이어받기 위해서)
        // =====================================================================
        const stored = JSON.parse(storedRaw) as TodaySandwich;
        if (stored?.date === today) {
          return buildTodaySandwich(today, habits, stored);
        }
      } catch {
        console.warn("failed!");
      }
    }
    //로컬스토리지에 저장돼있는거 없으면 새로 만듬
    return buildTodaySandwich(today, habits);
  });

  const daySandwich = useMemo<DaySandwich>(() => {
    return {
      ...todaySandwich,
      perfect: todaySandwich.habits.every((v) => v.completed),
    };
  }, [todaySandwich]);

  const sortedHabits = useMemo(() => {
    return [...habits].sort((a, b) => {
      const aCompleted =
        todaySandwich.habits.find((v) => v.habitId === a.id)?.completed ??
        false;
      const bCompleted =
        todaySandwich.habits.find((v) => v.habitId === b.id)?.completed ??
        false;

      if (aCompleted === bCompleted) return 0;
      return aCompleted ? 1 : -1;
    });
  }, [habits, todaySandwich.habits]);
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
      // 정확성 위해서 daySandwich 안쓰고 prev 사용..
      setTodaySandwich((prevToday) => {
        const prevDay: DaySandwich = {
          ...prevToday,
          perfect: prevToday.habits.every((v) => v.completed),
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
          habitTitle: newHabit.title,
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
        habit.habitId === id
          ? {
              ...habit,
              completed: !habit.completed,
              completedTime: new Date().getTime(),
            }
          : habit
      ),
    }));
  };
  // ===========================================================================
  //  습관 삭제 버튼
  // ===========================================================================
  const onDelete = (habitId: string) => {
    setTodaySandwich((prev) => ({
      ...prev,
      habits: prev.habits.filter((habit) => habit.habitId !== habitId),
    }));
    setHabits((prev) => prev.filter((v) => v.id !== habitId));
  };

  return (
    <div className={styles.container}>
      <div className={styles.appHeader}>
        <h2 className={styles.title}>Have it Sandwich 🥪</h2> <Clock></Clock>
      </div>
      <WeatherBackground weather={weather} />
      <h2 className={styles.welcome}>
        Welcome, {localStorage.getItem("name")} !
      </h2>

      <div className={styles.page}>
        <SandwichStack
          todaySandwich={todaySandwich}
          isPerfect={daySandwich.perfect}
        ></SandwichStack>
      </div>

      <Todolist
        styles={styles}
        isCreateOpen={isCreateOpen}
        onClickToCreate={onClickToCreate}
        onCreateHabit={onCreateHabit}
        onClosePopup={onClosePopup}
        sortedHabits={sortedHabits}
        todaySandwich={todaySandwich}
        ingredientImageMap={ingredientImageMap}
        onDelete={onDelete}
        onToggleDone={onToggleDone}
      />
    </div>
  );
};
export default Main;
