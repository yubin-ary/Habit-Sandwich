import WeatherApi from "../../sevices/WeatherApi";
const WeatherProvider = () => {
  let lat: number = 37;
  let lon: number = 126;

  navigator.geolocation.getCurrentPosition((position) => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
  });

  WeatherApi(lat, lon);
};
export default WeatherProvider;
