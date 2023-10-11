import { useEffect, useState } from 'react';

import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebaseUtils';
import CommandModule from './CommandModule';
import Consumer from './Consumer';
import PowerModule from './PowerModule';

const getAll = httpsCallable(functions, 'getAllModules');

export type PowerModule = {
  id: string;
  voltage: number;
  name: string;
  draining: boolean;
};
type ConsumerModule = {
  id: string;
  amper: number;
  name: string;
};
type SatelliteModules = {
  powerModules: PowerModule[];
  consumerModules: ConsumerModule[];
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
            <PowerModule key={pModule.id} id={pModule.id} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
          {modules.consumerModules.map((cModule) => (
            <Consumer
              key={cModule.id}
              name={cModule.name}
              amper={cModule.amper}
            />
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
