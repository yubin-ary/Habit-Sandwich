import type { Habit } from "./types";
type Props = {
  habits: Habit[];
  todayCount: number;
};
const Counter = ({ habits, todayCount }: Props) => {
  const allCount = habits.filter((v) => v.isDone === true).length;
  localStorage.setItem("allCount", `${allCount}`);
  return (
    <div>
      <h3>Today:{todayCount}</h3>
      <h3>All:{allCount}</h3>
    </div>
  );
};
export default Counter;
