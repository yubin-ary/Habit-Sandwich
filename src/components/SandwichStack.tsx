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
const SandwichStack = ({ todaySandwich, isPerfect }: Props) => {
  return (
    <div className={styles.stackContainer}>
      {todaySandwich.habits
        .filter((v) => v.completed === true)
        .sort((a, b) => Number(a.completedTime) - Number(b.completedTime))
        .map((v) => {
          return (
            <div className={styles.items} key={v.habitId}>
              <div className={styles.imgContainer}>
                <img src={ingredientImageMap[v.ingredient]}></img>
              </div>
              <div className={styles.habitTitle}>{v.habitTitle}</div>
            </div>
          );
        })}
      {isPerfect ? <div className={styles.items}>top bread</div> : null}
    </div>
  );
};
export default SandwichStack;
