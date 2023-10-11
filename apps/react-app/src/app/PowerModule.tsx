import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebaseUtils';
import { PowerModuleProps } from './RandomContainer';

type NoIdPowerModule = Omit<PowerModuleProps, 'id'>;
export default function PowerModule({ id }: { id: string }) {
  const [powerModule, setPowerModule] = useState<null | NoIdPowerModule>(null);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'power-modules', id), (doc) =>
      setPowerModule(doc.data() as NoIdPowerModule)
    );
    return unsub;
  }, [id]);

  return (
    <div>
      {powerModule && (
        <>
          <h4>{powerModule.name}</h4>
          <span>{powerModule.voltage.toFixed(1)}V</span>
        </>
      )}
    </div>
  );
}
