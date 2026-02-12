import styles from "../styles/SandwichStack.module.css";
type Props = {
  todaySandwich: {
    date: string;
    habits: {
      habitId: string;
      habitTitle?: string;
      completed: boolean;
      completedTime?: number;
      ingredient: string;
    }[];
  };
  isPerfect: boolean;
};
const SandwichStack = ({ todaySandwich, isPerfect }: Props) => {
  return (
    <div className={styles.stackContainer}>
      {todaySandwich.habits
        .filter((v) => v.completed === true)
        .sort((a, b) => Number(a.completedTime) - Number(b.completedTime))
        .map((v) => {
          return (
            <div className={styles.items} key={v.habitId}>
              {v.ingredient}
            </div>
          );
        })}
      {isPerfect ? <div className={styles.items}>top bread</div> : null}
    </div>
  );
};
export default SandwichStack;
