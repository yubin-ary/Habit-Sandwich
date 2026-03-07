import CreatePopup from "./CreatePopup";
import { motion } from "framer-motion";
import type { Habit, TodaySandwich } from "../types/types";

type Props = {
  styles: Record<string, string>;
  isCreateOpen: boolean;
  onClickToCreate: () => void;
  onCreateHabit: (title: string, ingredient: string) => void;
  onClosePopup: () => void;
  sortedHabits: Habit[];
  todaySandwich: TodaySandwich;
  ingredientImageMap: Record<string, string>;
  onDelete: (habitId: string) => void;
  onToggleDone: (habitId: string) => void;
};

const Todolist = ({
  styles,
  isCreateOpen,
  onClickToCreate,
  onCreateHabit,
  onClosePopup,
  sortedHabits,
  todaySandwich,
  ingredientImageMap,
  onDelete,
  onToggleDone,
}: Props) => {
  return (
    <div className={styles.todoContainer}>
      <div className={styles.todoHeader}>
        <div className={styles.todoText}>Todo</div>
        <button className={styles.createButton} onClick={onClickToCreate}>
          +
        </button>
      </div>
      {isCreateOpen ? (
        <CreatePopup
          onCreateHabit={onCreateHabit}
          onClosePopup={onClosePopup}
        ></CreatePopup>
      ) : null}
      <ul className={styles.list}>
        {sortedHabits.map((habit) => {
          const isCompleted =
            todaySandwich.habits.find((v) => v.habitId === habit.id)
              ?.completed ?? false;
          return (
            <motion.li
              key={habit.id}
              layout
              transition={{ type: "spring", stiffness: 500, damping: 38 }}
            >
              <div>
                <button
                  className={styles.deleteButton}
                  type="button"
                  onClick={() => {
                    onDelete(habit.id);
                  }}
                >
                  x
                </button>
                <img
                  className={styles.bullets}
                  src={ingredientImageMap[habit.ingredient]}
                ></img>
                {habit.title}
              </div>
              <button
                type="button"
                className={`${styles.todoToggleButton} ${
                  isCompleted ? styles.todoToggleOn : styles.todoToggleOff
                }`}
                onClick={() => {
                  onToggleDone(habit.id);
                }}
              >
                {isCompleted ? "✔" : ""}
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
};

export default Todolist;
