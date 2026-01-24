import { useState } from "react";
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
  const onChangeIngredient = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIngredient(e.target.value);
  };
  const onClick = () => {
    onCreateHabit(title, ingredient);
    onClosePopup();
  };
  return (
    <div>
      <input
        value={title}
        onChange={onChangeTitle}
        placeholder="Habit title"
      ></input>
      <select value={ingredient} onChange={onChangeIngredient}>
        <option value="default">Choose an ingredient</option>
        <option value="cheese">cheese</option>
        <option value="tomato">tomato</option>
        <option value="ham">ham</option>
      </select>
      <button onClick={onClick}>Save</button>
    </div>
  );
};
export default CreatePopup;
