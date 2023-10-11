import { useEffect, useState } from 'react';

import { httpsCallable } from 'firebase/functions';
import functions from '../../firebaseFunctions';
import Battery from './Battery';
import CommandModule from './CommandModule';
import Consumer from './Consumer';

const getAll = httpsCallable(functions, 'getAllModules');

type SatelliteModules = {
  powerModules: Array<{
    id: string;
    voltage: number;
    name: string;
    draining: boolean;
  }>;
  consumerModules: Array<{
    id: string;
    amper: number;
    name: string;
  }>;
};

export default function RandomContainer() {
  const [modules, setModules] = useState<null | SatelliteModules>(null);

  useEffect(() => {
    getAll().then((result) => {
      setModules(result.data as SatelliteModules);
    });
  }, []);

  if (!modules) {
    return (
      <div>
        <h3>Missing modules</h3>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
          {modules.powerModules.map((pModule) => (
            <Battery name={pModule.name} voltage={pModule.voltage} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
          {modules.consumerModules.map((cModule) => (
            <Consumer name={cModule.name} amper={cModule.amper} />
          ))}
        </div>
      </div>
      <CommandModule
        powerModules={modules.powerModules.map(({ draining, id }) => ({
          draining,
          powerSupplyId: id,
        }))}
      />
    </div>
  );
}
