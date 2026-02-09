export type Habit = {
  id: string;
  title: string;
  ingredient: string;
};
export type TodaySandwich = {
  date: string;
  habits: {
    habitId: string;
    habitTitle?: string;
    completed: boolean;
    ingredient: string;
  }[];
};
export type DaySandwich = {
  date: string;
  habits: {
    habitId: string;
    completed: boolean;
    ingredient: string;
  }[];
  perfect: boolean;
};
export type WeatherState = {
  PTY: string;
  T1H: string;
  SKY: string;
};
export type WeatherApiResponse = {
  response: {
    body: responseBody;
  };
};
export type responseBody = {
  items: {
    item: fcstItems[];
  };
};
export type fcstItems = {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: string;
  ny: string;
};
