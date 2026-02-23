import styles from "../styles/SandwichStack.module.css";
import bread from "../asset/bread.png";
import cheese from "../asset/cheese.png";
import ham from "../asset/ham.png";
import lettuce from "../asset/lettuce.png";
import tomato from "../asset/tomato.png";
import onion from "../asset/onion.png";

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
const ingredientImageMap: Record<string, string> = {
  bread,
  cheese,
  ham,
  lettuce,
  tomato,
  onion,
};

const BASE_BOTTOM = 35;
const STACK_GAP = 8;

const SandwichStack = ({ todaySandwich, isPerfect }: Props) => {
  const completedHabits = todaySandwich.habits
    .filter((v) => v.completed === true)
    .sort(
      (a, b) =>
        Number(a.completedTime ?? 0) - Number(b.completedTime ?? 0) ||
        a.habitId.localeCompare(b.habitId)
    );

  return (
    <div className={styles.stackContainer}>
      <div
        className={`${styles.items} ${styles.bread}`}
        style={{ bottom: "0px", zIndex: 1 }}
      >
        <div className={styles.imgContainer}>
          <img src={ingredientImageMap.bread}></img>
        </div>
      </div>

      {completedHabits.map((v, index) => (
        <div
          className={styles.items}
          style={{
            bottom: `${BASE_BOTTOM + index * STACK_GAP}px`,
            zIndex: index + 2,
          }}
          key={v.habitId}
        >
          <div className={styles.imgContainer}>
            <img src={ingredientImageMap[v.ingredient]}></img>
          </div>
          <div className={styles.habitTitle}>{v.habitTitle}</div>
        </div>
      ))}

      {isPerfect ? (
        <div
          className={styles.items}
          style={{
            bottom: `${
              BASE_BOTTOM + completedHabits.length * STACK_GAP - 10
            }px`,
            zIndex: completedHabits.length + 2,
          }}
        >
          <div className={styles.imgContainer}>
            <img src={ingredientImageMap.bread}></img>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SandwichStack;
