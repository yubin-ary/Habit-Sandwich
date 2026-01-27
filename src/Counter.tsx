import type { Habit } from "./types";
type Props = {
  habits: Habit[];
  todayCount: number;
};
const Counter = ({ habits, todayCount }: Props) => {
  return (
    <div>
      <h3>Today:{todayCount}</h3>
    </div>
  );
};
export default Counter;
