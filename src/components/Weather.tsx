import type { WeatherState } from "../types/types";

const xyRequest = async (url: string): Promise<string | undefined> => {
  try {
    const response = await fetch(url);
    if (!response) return undefined;

    const data = await response.text();
    /*
            자료형태
            #START7777
            #       LON,         LAT,   X,   Y
            127.000000,   35.000000,  61, 71 
            */
    return data;
  } catch {
    return undefined;
  }
};
const dataRequest = async <T = unknown,>(
  url: string
): Promise<T | undefined> => {
  try {
    const response = await fetch(url);
    if (!response) return undefined;
    const data = (await response.json()) as T;
    return data;
  } catch {
    return undefined;
  }
};
const getFullDate = (): number => {
  const date = new Date();
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return Number(year + month + day);
};

const getBaseHour = (): string => {
  let hour = String(new Date().getHours());
  let minute = String(new Date().getMinutes());
  if (Number(minute) >= 30) {
    return hour + "30";
  }
  if (Number(minute) < 30) {
    hour = `${Number(hour) - 1}`;
    return hour + "30";
  }
};
const Weather = () => {
  let nx: string;
  let ny: string;
  let fullDate: number;
  let baseHour: string;
  let lat: number;
  let lon: number;

  // =============================================================================
  // basehour 생성.  매시 30분에 데이터가 생성되고, 그데이터 안 fcstTime프로퍼티에 그 시간 기준 30분후 예보와, 1시간 간격으로 6시간의 예보 정보가 있다.
  // =============================================================================

  baseHour = getBaseHour();

  // =============================================================================
  // 현재위치 위도,경도 가져옴
  // =============================================================================
  navigator.geolocation.getCurrentPosition((position) => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    getXY(lat, lon);
  });
  // =============================================================================
  // 위도, 경도 기준으로 동네예보 xy 좌표로 바꿔줌
  // =============================================================================

  async function getXY(lat, lon) {
    let XY_API_URL = `https://apihub.kma.go.kr/api/typ01/cgi-bin/url/nph-dfs_xy_lonlat?lon=${lon}&lat=${lat}&help=0&authKey=aqS254aBTp-ktueGge6fkg`;
    const data = await xyRequest(XY_API_URL);
    if (data) {
      nx = data.split(",")[5].trimStart();
      ny = data.split(",")[6].trimStart();
      urlMaker(fullDate, baseHour, parseInt(nx), parseInt(ny));
    }
  }
  // =============================================================================
  // 변수 다 데리고와서 api 호출
  // =============================================================================
  async function urlMaker(fullDate, baseHour, nx, ny) {
    let url;
    url = `https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtFcst?pageNo=1&numOfRows=30&dataType=json&base_date=${fullDate}&base_time=${baseHour}&nx=${nx}&ny=${ny}&authKey=aqS254aBTp-ktueGge6fkg`;

    let url2 = `https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtNcst?pageNo=1&numOfRows=5&dataType=JSON&base_date=${fullDate}&base_time=${
      String(date.getHours()).padStart(2, 0) + "00"
    }&nx=${nx}&ny=${ny}&authKey=aqS254aBTp-ktueGge6fkg`;

    const response = await dataRequest(url);
    let skyData;
    if (response) {
      let data = response.response.body.items.item
        .filter((elm) => {
          return elm.fcstTime == `${parseInt(baseHour.slice(0, 2)) + 1}00`;
        })
        .filter((elm) => {
          return elm.category == "SKY";
        });
      skyData = data[0].fcstValue;
    }

    const response2 = await dataRequest(url2);
    let ptyData;
    if (response2) {
      console.log(response2);
      console.log(url2);
      let data = response2.response.body.items.item.filter((elm) => {
        return elm.category == "PTY";
      });
      ptyData = data[0].obsrValue;
    }
    let t1hData;
    if (response2) {
      let data = response2.response.body.items.item.filter((elm) => {
        return elm.category == "T1H";
      });
      t1hData = data[0].obsrValue;
    }

    setData(skyData, ptyData, t1hData);
  }
  // =============================================================================
  //   pty 강수상태, t1h 기온, sky 하늘상태 지정

  // =============================================================================

  let weatherState = {
    PTY: "",
    T1H: "",
    SKY: "",
  };

  function setData(skyData, ptyData, t1hData) {
    weatherState.SKY = skyData;
    weatherState.PTY = ptyData;
    weatherState.T1H = t1hData;
    renderWeather();
  }
  // =============================================================================
  // 화면에 날씨 표시
  // =============================================================================

  function renderWeather() {
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
  }
  return <div>weather</div>;
};
export default Weather;
