export default function CommandButton({ connected }: { connected: boolean }) {
  return (
    <button style={{ maxWidth: 200 }}>
      {connected ? 'Disconnect' : 'Connect'}
    </button>
  );
}
