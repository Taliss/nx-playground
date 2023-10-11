import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebaseUtils';
import { ConsumerModuleProps } from './RandomContainer';

type NoIdConsumerModule = Omit<ConsumerModuleProps, 'id'>;

export default function Consumer({ id }: { id: string }) {
  const [consumerModule, setConsumerModule] =
    useState<null | NoIdConsumerModule>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'consumer-modules', id), (doc) =>
      setConsumerModule(doc.data() as NoIdConsumerModule)
    );
    return unsub;
  }, [id]);
  return (
    <div>
      {consumerModule && (
        <>
          <h3>{consumerModule.name}</h3>
          <span>{consumerModule.amper.toFixed(1)}A</span>
        </>
      )}
    </div>
  );
}
