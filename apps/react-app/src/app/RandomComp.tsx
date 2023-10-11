import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import { useEffect, useState } from 'react';
import firebaseApp from '../../firebaseApp';

const functions = getFunctions(firebaseApp);
console.log(import.meta.env);
if (import.meta.env.MODE !== 'production' && import.meta.env.PROD !== true) {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
const slimShady = httpsCallable(functions, 'connectConsumer');
const getAll = httpsCallable(functions, 'getAllModules');

type HelloWorldData = {
  foo: 'string';
  bar: 'string';
  baz: 'string';
};
export default function RandomComp() {
  const [data, setData] = useState<HelloWorldData | null>(null);
  useEffect(() => {
    getAll()
      .then((result) => {
        const reqData = result.data;
        console.log(result, ' ?!?');
        setData(reqData as HelloWorldData);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (!data) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <div>
        <div>Battery-A</div>
        <div>Battery-B</div>
      </div>

      <div>
        <div>
          <h3>Consumer-A</h3>
          <button
            style={{ width: 100, height: 40 }}
            onClick={() => console.log('connecting consumer-A')}
          >
            Connect
          </button>
        </div>
        <div>
          <h3>Consumer-B</h3>
          <button
            style={{ width: 100, height: 40 }}
            onClick={() => console.log('connecting consumer-B')}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
