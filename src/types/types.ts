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
    completedTime?: number;
    ingredient: string;
  }[];
};
export type DaySandwich = {
  date: string;
  habits: {
    habitId: string;
    completed: boolean;
    completedTime?: number;
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
  obsrValue?: string;
  nx: string;
  ny: string;
};
