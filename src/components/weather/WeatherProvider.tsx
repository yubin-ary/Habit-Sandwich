import { useEffect, useState } from "react";
import WeatherApi from "../../sevices/WeatherApi";

const WeatherProvider = () => {
  const [weather, setWeather] = useState<{
    sky?: string;
    pty?: string;
  }>({});

  useEffect(() => {
    const fallbackLat = 37;
    const fallbackLon = 126;

    const loadWeather = async (lat: number, lon: number) => {
      const ans = await WeatherApi(lat, lon);
      const [SKY, PTY] = ans ?? [undefined, undefined];
      setWeather({ sky: SKY, pty: PTY });
      console.log(SKY);
      console.log(PTY);
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // =====================================================================
        // 위치 권한 허용+ 위치 조회 성공시 실행
        // =====================================================================
        void loadWeather(position.coords.latitude, position.coords.longitude);
      },
      // =======================================================================
      //  위치 권한 거부시 실행
      // =======================================================================
      () => {
        void loadWeather(fallbackLat, fallbackLon);
      }
    );
  }, []);

  return (
    <div>
      {weather.sky} {weather.pty}
    </div>
  );
};

export default WeatherProvider;
