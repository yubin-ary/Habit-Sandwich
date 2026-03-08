import type { WeatherApiResponse } from "../types/types";

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
const RE = 6371.00877;
const GRID = 5.0;

const SLAT1 = 30.0;
const SLAT2 = 60.0;
const OLON = 126.0;
const OLAT = 38.0;

const XO = 43;
const YO = 136;

function getXY(lat: number, lon: number): number[] | undefined {
  const DEGRAD = Math.PI / 180;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  const sn =
    Math.log(Math.cos(slat1) / Math.cos(slat2)) /
    Math.log(
      Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
        Math.tan(Math.PI * 0.25 + slat1 * 0.5)
    );

  const sf =
    (Math.tan(Math.PI * 0.25 + slat1 * 0.5) ** sn * Math.cos(slat1)) / sn;

  const ro = (re * sf) / Math.tan(Math.PI * 0.25 + olat * 0.5) ** sn;

  const ra = (re * sf) / Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5) ** sn;

  let theta = lon * DEGRAD - olon;

  if (theta > Math.PI) theta -= 2 * Math.PI;
  if (theta < -Math.PI) theta += 2 * Math.PI;

  theta *= sn;

  const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

  return [nx, ny];
}

/* return [nx, ny]; */

function urlMaker(
  fullDate: number,
  baseHour: string | undefined,
  nx: number,
  ny: number
): string[] {
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
const getPtyData = async (url2: string): Promise<string | undefined> => {
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
  const nxny = getXY(lat, lon);
  if (!nxny) {
    return;
  }
  const [nx, ny] = nxny;
  const [url, url2] = urlMaker(fullDate, baseHour, nx, ny);
  // ===========================================================================
  // url 만든다
  // ===========================================================================

  // ===========================================================================
  // sky 정보 가져옴
  // ===========================================================================
  const SKY = getSkyData(url, baseHour);
  // =============================================================================
  //   pty 강수상태
  // =============================================================================
  const PTY = getPtyData(url2);
  const [sky, pty] = await Promise.all([SKY, PTY]);
  return [sky, pty];
};
export default WeatherApi;
