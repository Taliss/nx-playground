import { httpsCallable } from 'firebase/functions';
import functions from '../../firebaseFunctions';
import CommandButton from './CommandButton';

const connectConsumer = httpsCallable<unknown, string>(
  functions,
  'connectConsumer'
);
const disconnectConsumer = httpsCallable<unknown, string>(
  functions,
  'disconnectConsumer'
);

// Its bad to rely positioning, but...
export default function CommandModule({
  powerModules,
}: {
  powerModules: { powerSupplyId: string; draining: boolean }[];
}) {
  const handleOnClick = (powerSupplyId: string, draining: boolean) => {
    return () =>
      draining
        ? disconnectConsumer({ powerSupplyId })
        : connectConsumer({ powerSupplyId });
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '50% 50%' }}>
      {powerModules.map(({ powerSupplyId, draining }) => (
        <CommandButton
          key={powerSupplyId}
          onClickHandler={handleOnClick(powerSupplyId, draining)}
        >
          {draining ? 'Disconnect' : 'Connect'}
        </CommandButton>
      ))}
    </div>
  );
}
