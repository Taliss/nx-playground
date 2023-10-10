import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import { useEffect, useState } from 'react';
import firebaseApp from '../../firebaseApp';

const functions = getFunctions(firebaseApp);
connectFunctionsEmulator(functions, 'localhost', 5001);
const getHelloWorld = httpsCallable(functions, 'helloWorld');

type HelloWorldData = {
  foo: 'string';
  bar: 'string';
  baz: 'string';
};
export default function RandomComp() {
  const [data, setData] = useState<HelloWorldData | null>(null);
  useEffect(() => {
    getHelloWorld()
      .then((result) => {
        const reqData = result.data;
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
    <h2>
      <span>FOO: {data.foo}</span>
      <span>BAR: {data.bar}</span>
      <span>BAZ: {data.baz}</span>
    </h2>
  );
}
