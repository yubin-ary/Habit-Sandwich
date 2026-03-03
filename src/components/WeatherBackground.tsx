type WeatherType =
  | "rain"
  | "snow"
  | "sunny"
  | "mostly-sunny"
  | "cloudy"
  | "default";
type weather = {
  weather: {
    pty?: string;
    sky?: string;
  };
};
const getWeatherType = (pty?: string, sky?: string): WeatherType => {
  if (["1", "2", "5"].includes(pty ?? "")) {
    return "rain";
  }
  if (["3", "6", "7"].includes(pty ?? "")) {
    return "snow";
  }
  if (pty === "0") {
    if (sky === "1") return "sunny";
    if (sky === "2") return "mostly-sunny";
    if (sky === "3") return "cloudy";
  }
  return "default";
};
export const WeatherBackground = ({ weather }: weather) => {
  const nowWeather = getWeatherType(weather.pty, weather.sky);
  switch (nowWeather) {
    case "rain":
      return 1;
    case "snow":
      return 2;
    case "sunny":
      return 3;
    case "mostly-sunny":
      return 4;
    case "cloudy":
      return 5;
    case "default":
      return 6;
  }
  return <></>;
};

/* function renderWeather() {
    let $weather = document.querySelector("#weather");
    let nowSky, nowRain;
    if (weatherState.SKY == 1) {
      nowSky = "Sunny ☀️";
    } else if (weatherState.SKY == 3) {
      nowSky = "Mostly Cloudy 🌤️";
    } else if (weatherState.SKY == 4) {
      nowSky = "Cloudy ☁️";
    }
    switch (weatherState.PTY) {
      case "0":
        nowRain = "";
        break;
      case "1":
        nowRain = "Rain ☔️";
        break;
      case "2":
        nowRain = "Rain/Snow ☔️";
        break;
      case "3":
        nowRain = "Snow ❄️";
        break;
      case "5":
        nowRain = "Raindrops 💧";
        break;
      case "6":
        nowRain = "Raindrops/Snow Flurries 💧❄️";
        break;
      case "7":
        nowRain = "Snow Flurries ❄️";
        break;
    }
  } */
