type Props = {
  layers: string[];
};
const SandwichStack = ({ layers }: Props) => {
  return (
    <div>
      {[...layers].reverse().map((v, i) => (
        <div key={i}>{v}</div>
      ))}
    </div>
  );
};
export default SandwichStack;
