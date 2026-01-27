type Props = {
  todaySandwich: {
    date: string;
    habits: {
      habitId: string;
      completed: boolean;
      ingredient: string;
    }[];
  };
};
const SandwichStack = ({ todaySandwich }: Props) => {
  return (
    <div>
      {todaySandwich.habits
        .filter((v) => v.completed === true)
        .map((v) => {
          return <div>{v.ingredient}</div>;
        })}
    </div>
  );
};
export default SandwichStack;
