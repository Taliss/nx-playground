import { doc, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useEffect, useState } from 'react';
import { db, functions } from '../../firebaseUtils';

const connectConsumer = httpsCallable<unknown, string>(
  functions,
  'connectConsumer'
);
const disconnectConsumer = httpsCallable<unknown, string>(
  functions,
  'disconnectConsumer'
);
export default function CommandButton({
  powerSupplyId,
}: {
  powerSupplyId: string;
}) {
  const [connected, setConnected] = useState<boolean>(false);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'power-modules', powerSupplyId), (doc) =>
      setConnected(doc.data()?.draining || false)
    );
    return unsub;
  }, [powerSupplyId]);

  const handleOnClick = () => {
    connected
      ? disconnectConsumer({ powerSupplyId })
      : connectConsumer({ powerSupplyId });
  };
  return (
    <button onClick={() => handleOnClick()} style={{ maxWidth: 200 }}>
      {connected ? 'Disconnect' : 'Connect'}
    </button>
  );
}
