import { useEffect, useState } from "react";
import styles from "./Clock.module.css";

const formatTime = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

const Clock = () => {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(formatTime(new Date()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <div className={styles.clock}>{time}</div>;
};
export default Clock;
