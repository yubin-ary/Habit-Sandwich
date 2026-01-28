type Props = {
  todaySandwich: {
    date: string;
    habits: {
      habitId: string;
      habitTitle?: string;
      completed: boolean;
      ingredient: string;
    }[];
  };
  isPerfect: boolean;
};
const SandwichStack = ({ todaySandwich, isPerfect }: Props) => {
  return (
    <div>
      {isPerfect ? <div>top bread</div> : null}
      {todaySandwich.habits
        .filter((v) => v.completed === true)
        .map((v) => {
          return <div>{v.ingredient}</div>;
        })}
    </div>
  );
};
export default SandwichStack;
