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
