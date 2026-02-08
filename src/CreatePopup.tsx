import { useState } from "react";
import styles from "./CreatePopup.module.css";
type Props = {
  onCreateHabit: (title: string, ingredient: string) => void;
  onClosePopup: () => void;
};
const CreatePopup = ({ onCreateHabit, onClosePopup }: Props) => {
  const [title, setTitle] = useState("");
  const [ingredient, setIngredient] = useState("");
  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const onChangeIngredient = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value;
    setIngredient((prev) => (prev === value ? "" : value));
  };
  const onClick = () => {
    if (title !== "" && ingredient !== "") {
      onCreateHabit(title, ingredient);
      onClosePopup();
    }
  };
  const onClose = () => {
    onClosePopup();
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.popupBox}>
        <h4>Habit title</h4>
        <input
          className={styles.input}
          value={title}
          onChange={onChangeTitle}
          placeholder=""
        ></input>
        <h4>Ingredients</h4>
        <div className={styles.buttons}>
          <button
            className={`${styles.items} ${
              ingredient === "cheese" ? styles.active : ""
            }`}
            onClick={onChangeIngredient}
            value="cheese"
          >
            cheese
          </button>
          <button
            className={`${styles.items} ${
              ingredient === "ham" ? styles.active : ""
            }`}
            onClick={onChangeIngredient}
            value="ham"
          >
            ham
          </button>
          <button
            className={`${styles.items} ${
              ingredient === "tomato" ? styles.active : ""
            }`}
            onClick={onChangeIngredient}
            value="tomato"
          >
            tomato
          </button>
          <button
            className={`${styles.items} ${
              ingredient === "lettuce" ? styles.active : ""
            }`}
            onClick={onChangeIngredient}
            value="lettuce"
          >
            lettuce
          </button>
          <button
            className={`${styles.items} ${
              ingredient === "onion" ? styles.active : ""
            }`}
            onClick={onChangeIngredient}
            value="onion"
          >
            onion
          </button>
          <button
            className={`${styles.items} ${
              ingredient === "sbjam" ? styles.active : ""
            }`}
            onClick={onChangeIngredient}
            value="sbjam"
          >
            strawberry jam
          </button>
          <button
            className={`${styles.items} ${
              ingredient === "pickle" ? styles.active : ""
            }`}
            onClick={onChangeIngredient}
            value="pickle"
          >
            pickle
          </button>
          <button
            className={`${styles.items} ${
              ingredient === "egg" ? styles.active : ""
            }`}
            onClick={onChangeIngredient}
            value="egg"
          >
            egg
          </button>
          <button
            className={`${styles.items} ${
              ingredient === "bacon" ? styles.active : ""
            }`}
            onClick={onChangeIngredient}
            value="bacon"
          >
            bacon
          </button>
          <button
            className={`${styles.items} ${
              ingredient === "tuna" ? styles.active : ""
            }`}
            onClick={onChangeIngredient}
            value="tuna"
          >
            tuna
          </button>
          <button
            className={`${styles.items} ${
              ingredient === "avocado" ? styles.active : ""
            }`}
            onClick={onChangeIngredient}
            value="avocado"
          >
            avocado
          </button>
          <button
            className={`${styles.items} ${
              ingredient === "mustard" ? styles.active : ""
            }`}
            onClick={onChangeIngredient}
            value="mustard"
          >
            mustard
          </button>
          <button
            className={`${styles.items} ${
              ingredient === "apple" ? styles.active : ""
            }`}
            onClick={onChangeIngredient}
            value="apple"
          >
            apple
          </button>
          <button
            className={`${styles.items} ${
              ingredient === "pb" ? styles.active : ""
            }`}
            onClick={onChangeIngredient}
            value="pb"
          >
            peanut butter
          </button>
          <button
            className={`${styles.items} ${
              ingredient === "mushroom" ? styles.active : ""
            }`}
            onClick={onChangeIngredient}
            value="mushroom"
          >
            mushroom
          </button>
        </div>
        {/*  <select
          className={styles.option}
          value={ingredient}
          onChange={onChangeIngredient}
        >
          <option value="default">Choose an ingredient</option>
          <option value="cheese">cheese</option>
          <option value="tomato">tomato</option>
          <option value="ham">ham</option>
        </select> */}
        <div className={styles.confirm}>
          <button className={styles.backButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={onClick}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
export default CreatePopup;
