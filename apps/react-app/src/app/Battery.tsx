export default function Battery({
  name,
  voltage,
}: {
  name: string;
  voltage: number;
}) {
  return (
    <div>
      <h4>{name}</h4>
      <span>{voltage}V</span>
    </div>
  );
}
