import { useEffect, useState } from 'react';

import { Unsubscribe, doc, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../../../firebaseUtils';
import Button from './Button';

const getAll2 = httpsCallable(functions, 'getAllModules2');

export type PowerConsumerModuleProps = {
  id: string;
  batteryName: string;
  consumerName: string;
  statsId: string;
  inUse: boolean;
};
export type StatsProps = {
  id: string;
  amper: number;
  voltage: number;
};
type SatelliteProps = {
  modules: PowerConsumerModuleProps[];
  stats: StatsProps[];
};

type LiveModules = {
  [key in PowerConsumerModuleProps['id']]: PowerConsumerModuleProps;
};
type LiveStats = {
  [key in StatsProps['id']]: StatsProps;
};

export default function RandomContainer() {
  const [satteliteData, setModules] = useState<null | SatelliteProps>(null);
  const [liveModules, setLiveModules] = useState<null | LiveModules>(null);
  const [liveStats, setLiveStats] = useState<null | LiveStats>(null);

  useEffect(() => {
    getAll2().then((result) => {
      setModules(result.data as SatelliteProps);
    });
  }, []);

  useEffect(() => {
    const subs: Unsubscribe[] = [];
    if (satteliteData?.modules) {
      satteliteData.modules.forEach(({ id }) => {
        const unsub = onSnapshot(doc(db, 'power-payload-module', id), (doc) =>
          setLiveModules((state) => ({
            ...state,
            [id]: doc.data() as PowerConsumerModuleProps,
          }))
        );
        subs.push(unsub);
      });
    }
    return () => subs.forEach((sub) => sub());
  }, [satteliteData?.modules]);

  useEffect(() => {
    const subs: Unsubscribe[] = [];
    if (satteliteData?.stats) {
      satteliteData.stats.forEach(({ id }) => {
        const unsub = onSnapshot(doc(db, 'stats', id), (doc) =>
          setLiveStats((state) => ({
            ...state,
            [id]: doc.data() as StatsProps,
          }))
        );
        subs.push(unsub);
      });
    }
    return () => subs.forEach((sub) => sub());
  }, [satteliteData?.stats]);

  if (!satteliteData || !liveModules || !liveStats) {
    return (
      <div>
        <h3>Missing modules</h3>
      </div>
    );
  }
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
        {satteliteData.modules.map(({ id }) => (
          <div key={id}>
            <h4>{liveModules[id].batteryName}</h4>
            <span>{liveStats[liveModules[id].statsId].voltage}V</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
        {satteliteData.modules.map(({ id }) => (
          <div key={id}>
            <h4>{liveModules[id].consumerName}</h4>
            <span>{liveStats[liveModules[id].statsId].amper}V</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
        {satteliteData.modules.map(({ id }) => (
          <Button key={id} id={id} connected={liveModules[id].inUse} />
        ))}
      </div>
    </div>
  );

  // return (
  //   <div>
  //     <div>
  //       <div style={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
  //         {modules.powerModules.map((pModule) => (
  //           <PowerModule key={pModule.id} id={pModule.id} />
  //         ))}
  //       </div>
  //       <div style={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
  //         {modules.consumerModules.map(({ id }) => (
  //           <Consumer key={id} id={id} />
  //         ))}
  //       </div>
  //     </div>
  //     <div style={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
  //       {modules.powerModules.map(({ id }) => (
  //         <CommandButton key={id} powerSupplyId={id} />
  //       ))}
  //     </div>
  //   </div>
  // );
}
