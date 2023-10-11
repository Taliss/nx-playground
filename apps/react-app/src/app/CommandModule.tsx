import CommandButton from './CommandButton';

// Its bad to rely positioning, but...
export default function CommandModule({
  connections,
}: {
  connections: boolean[];
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
      <CommandButton connected={connections[0]} />
      <CommandButton connected={connections[1]} />
    </div>
  );
}
