import type { Habit } from "./types";
type Props = {
  habits: Habit[];
};
const Counter = ({ habits }: Props) => {
  const todayCount = habits.filter(
    (v) => v.completedDate === new Date().toLocaleDateString("sv-SE")
  ).length;
  const allCount = habits.filter((v) => v.isDone === true).length;

  return (
    <div>
      <h3>Today:{todayCount}</h3>
      <h3>All:{allCount}</h3>
    </div>
  );
};
export default Counter;
