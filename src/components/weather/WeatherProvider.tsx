import { useEffect, useState, createContext, type ReactNode } from "react";
import WeatherApi from "../../sevices/WeatherApi";
type weatherType = {
  sky?: string;
  pty?: string;
};
export const weatherContext = createContext<weatherType>({});
export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [weather, setWeather] = useState<weatherType>({});

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
    <weatherContext.Provider value={weather}>
      {children}
    </weatherContext.Provider>
  );
};
