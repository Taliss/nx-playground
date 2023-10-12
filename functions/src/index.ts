import { initializeApp } from 'firebase-admin/app';
import { DocumentReference, getFirestore } from 'firebase-admin/firestore';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onCall } from 'firebase-functions/v2/https';

initializeApp();
const firestore = getFirestore();

// gRPC my old friend
export const connect = onCall<{ id: string }, Promise<string>>(
  async (request) => {
    const { id } = request.data;
    const docRef = firestore.collection('power-payload-module').doc(id);

    await docRef.update({ inUse: true });
    return `Power Module with id: ${id} is now in use!`;
  }
);

export const disconnect = onCall<{ id: string }, Promise<string>>(
  async (request) => {
    const { id } = request.data;
    const powerSupplyRef = firestore.collection('power-payload-module').doc(id);

    await powerSupplyRef.update({ inUse: false });
    return `Power Module with id: ${id} is now charging!`;
  }
);

export const getAllModules = onCall(async (req) => {
  const documentRefs = await Promise.all(
    ['power-payload-module', 'stats'].map((coll) =>
      firestore.collection(coll).listDocuments()
    )
  );

  const documentSnapshots = await Promise.all([
    firestore.getAll(...documentRefs[0]),
    firestore.getAll(...documentRefs[1]),
  ]);

  return {
    modules: documentSnapshots[0].map((snapshot) => ({
      id: snapshot.id,
      ...snapshot.data(),
    })),
    stats: documentSnapshots[1].map((snapshot) => ({
      id: snapshot.id,
      ...snapshot.data(),
    })),
  };
});

const updateStatsContinuously = async (
  moduleRef: DocumentReference,
  statsRef: DocumentReference,
  innitialInUseState: boolean,
  {
    mode,
    tickInterval = 1000,
  }: { mode: 'drain' | 'charge'; tickInterval?: number }
) => {
  const intervalId = setInterval(() => {
    firestore.runTransaction(async (t) => {
      const [moduleDoc, statsDoc] = await t.getAll(moduleRef, statsRef);

      // Validations
      if (!moduleDoc.exists || !statsDoc.exists) {
        throw new Error('One of the docs does not exist');
      }

      // Check if the status of the connection when the trigger function was invoked
      // is different than the one at the current iteration of the transaction.
      // If so, we clean interVal and do not apply changes
      if (!!moduleDoc.data()?.inUse !== innitialInUseState) {
        clearTimeout(intervalId);
        return;
      }

      // TODO: I need to dig in the dog on how to use TS with this library. Unfortunately no examples for now.
      const { voltage, amper } = statsDoc.data() as {
        amper: number;
        voltage: number;
      };

      const newVoltage = mode === 'drain' ? voltage - 3 : voltage + 3;
      // I don't want to add extra library  for precision, but in reallity I'll do it
      const newAmper = parseFloat(
        (mode === 'drain' ? amper + 0.4 : amper - 0.4).toFixed(10)
      );

      // Validate only on voltage in order to not deal with JS and floating point numbers!
      // Tick steps are proportional on purpose!
      if (newVoltage > 30 || newVoltage < 0) {
        clearInterval(intervalId);
        return;
      }

      t.update(statsRef, {
        voltage: newVoltage,
        amper: newAmper,
      });
      console.log(`${mode} tick applied to ${moduleDoc.id} module pair!`);
    });
  }, tickInterval);
};

export const updateStats = onDocumentUpdated(
  'power-payload-module/{id}',
  async (event) => {
    const moduleRef = firestore
      .collection('power-payload-module')
      .doc(event.params.id);
    const statsRef = firestore
      .collection('stats')
      .doc(event.data?.after.data().statsId);

    // fire and forget
    updateStatsContinuously(
      moduleRef,
      statsRef,
      event.data?.after.data().inUse,
      {
        mode: event.data?.after.data().inUse === true ? 'drain' : 'charge',
      }
    );
  }
);
