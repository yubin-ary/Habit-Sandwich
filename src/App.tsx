import { useState } from "react";
import Main from "./pages/Main";
import Onboarding from "./pages/Onboarding";
import { WeatherProvider } from "./components/weather/WeatherProvider";

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
        <WeatherProvider>
          <Main></Main>
        </WeatherProvider>
      ) : (
        <Onboarding onNameSet={onNameSet}></Onboarding>
      )}
    </>
  );
}

export default App;
