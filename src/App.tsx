import { useState } from "react";
import Main from "./Main";
import Onboarding from "./Onboarding";

function App() {
  const [userName, setUserName] = useState(() => {
    const savedName = localStorage.getItem("name");
    return savedName ? savedName : "";
  });
  const onNameSet = (nameInput: string) => {
    setUserName(nameInput);
    localStorage.setItem("name", nameInput);
  };

  return (
    <>
      {userName ? (
        <Main></Main>
      ) : (
        <Onboarding onNameSet={onNameSet}></Onboarding>
      )}
    </>
  );
}

export default App;
