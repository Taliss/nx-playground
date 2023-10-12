import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../firebaseUtils';

const connectConsumer = httpsCallable<unknown, string>(functions, 'connect');
const disconnectConsumer = httpsCallable<unknown, string>(
  functions,
  'disconnect'
);
export default function CommandButton({
  id,
  connected,
}: {
  id: string;
  connected: boolean;
}) {
  const handleOnClick = () => {
    connected ? disconnectConsumer({ id }) : connectConsumer({ id });
  };
  return (
    <button onClick={() => handleOnClick()} style={{ maxWidth: 200 }}>
      {connected ? 'Disconnect' : 'Connect'}
    </button>
  );
}
