export default function Consumer({
  name,
  amper,
}: {
  name: string;
  amper: number;
}) {
  return (
    <div>
      <h3>{name}</h3>
      <span>{amper}A</span>
    </div>
  );
}
