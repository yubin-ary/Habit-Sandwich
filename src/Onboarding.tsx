import { useState } from "react";
type Props = {
  onNameSet: (name: string) => void;
};
const Onboarding = ({ onNameSet }: Props) => {
  const [nameInput, setNameInput] = useState("");
  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
  };
  const handleSubmit = () => {
    onNameSet(nameInput);
  };
  return (
    <>
      <input value={nameInput} onChange={onchange}></input>
      <button onClick={handleSubmit}>시작</button>
    </>
  );
};
export default Onboarding;
