import type { WeatherApiResponse } from "../types/types";
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
const dataRequest = async (
  url: string
): Promise<WeatherApiResponse | undefined> => {
  try {
    const response = await fetch(url);
    if (!response) return undefined;
    const data = (await response.json()) as WeatherApiResponse;
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
  const minute = String(new Date().getMinutes());
  if (Number(minute) >= 30) {
    return hour.padStart(2, "0") + "30";
  } else {
    hour = String(Number(hour) - 1);
    return hour.padStart(2, "0") + "30";
  }
};
async function getXY(lat: number, lon: number): Promise<string[] | undefined> {
  const XY_API_URL: string = `/kma/api/typ01/cgi-bin/url/nph-dfs_xy_lonlat?lon=${lon}&lat=${lat}&help=0&authKey=aqS254aBTp-ktueGge6fkg`;
  try {
    const data: string | undefined = await xyRequest(XY_API_URL);
    if (data) {
      const nx = data.split(",")[5].trimStart();
      const ny = data.split(",")[6].trimStart();
      return [nx, ny];
    }
  } catch {
    return undefined;
  }
}
async function urlMaker(
  fullDate: number,
  baseHour: string | undefined,
  nx: number,
  ny: number
): Promise<string[]> {
  const url = `/kma/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtFcst?pageNo=1&numOfRows=30&dataType=json&base_date=${fullDate}&base_time=${baseHour}&nx=${nx}&ny=${ny}&authKey=aqS254aBTp-ktueGge6fkg`;

  const url2 = `/kma/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtNcst?pageNo=1&numOfRows=5&dataType=JSON&base_date=${fullDate}&base_time=${
    String(new Date().getHours()).padStart(2, "0") + "00"
  }&nx=${nx}&ny=${ny}&authKey=aqS254aBTp-ktueGge6fkg`;

  return [url, url2];
}
const getSkyData = async (
  url: string,
  baseHour: string
): Promise<string | undefined> => {
  try {
    const response1: WeatherApiResponse | undefined = await dataRequest(url);
    if (!response1) return;
    const data = response1.response.body.items.item
      .filter((elm) => {
        if (!baseHour) return;
        return elm.fcstTime == `${Number(baseHour.slice(0, 2)) + 1}00`;
      })
      .filter((v) => {
        return v.category == "SKY";
      });
    return data[0].fcstValue;
  } catch {
    return;
  }
};
const getPtyData = async (
  url2: string,
  baseHour: string
): Promise<string | undefined> => {
  try {
    const response2: WeatherApiResponse | undefined = await dataRequest(url2);
    if (!response2) return;
    const data = response2.response.body.items.item.filter((v) => {
      return v.category == "PTY";
    });
    return data[0].obsrValue;
  } catch {
    return;
  }
};

const WeatherApi = async (
  lat: number,
  lon: number
): Promise<[string | undefined, string | undefined] | undefined> => {
  const fullDate: number = getFullDate();
  const baseHour: string = getBaseHour();

  // =============================================================================
  // basehour 생성.  매시 30분에 데이터가 생성되고, 그데이터 안 fcstTime프로퍼티에 그 시간 기준 30분후 예보와, 1시간 간격으로 6시간의 예보 정보가 있다.
  // =============================================================================/*  */

  // =============================================================================
  // 위도, 경도 기준으로 동네예보 xy 좌표로 바꿔줌
  // =============================================================================
  const nxny = await getXY(lat, lon);
  if (!nxny) {
    return;
  }
  const [nx, ny] = nxny;
  const urls = await urlMaker(fullDate, baseHour, Number(nx), Number(ny));
  if (!urls) {
    return;
  }
  // ===========================================================================
  // url 만든다
  // ===========================================================================
  const [url, url2] = urls;

  // ===========================================================================
  // sky 정보 가져옴
  // ===========================================================================
  const SKY = getSkyData(url, baseHour);
  // =============================================================================
  //   pty 강수상태
  // =============================================================================
  const PTY = getPtyData(url2, baseHour);
  const [sky, pty] = await Promise.all([SKY, PTY]);
  return [sky, pty];

  /* const response2 = await dataRequest(url2);
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
  } */
};
export default WeatherApi;
