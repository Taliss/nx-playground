/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onCall } from 'firebase-functions/v2/https';

initializeApp();
const firestore = getFirestore();

type ConnectConsumer = { powerSupplyId: string; consumerId: string };

export const connectConsumer = onCall<ConnectConsumer, unknown>(
  async (request) => {
    const { powerSupplyId } = request.data;

    const powerSupplyRef = firestore
      .collection('power-modules')
      .doc(powerSupplyId);

    await powerSupplyRef.update({ draining: true });
    return `Power Module with id:${powerSupplyId} is now in use`;
  }
);

export const getAllModules = onCall(async (req) => {
  const documentRefs = await Promise.all(
    ['power-modules', 'consumer-modules'].map((coll) =>
      firestore.collection(coll).listDocuments()
    )
  );

  const documentSnapshots = await Promise.all([
    firestore.getAll(...documentRefs[0]),
    firestore.getAll(...documentRefs[1]),
  ]);

  return {
    powerModules: documentSnapshots[0].map((snapshot) => ({
      id: snapshot.id,
      ...snapshot.data(),
    })),
    consumerModules: documentSnapshots[1].map((snapshot) => ({
      id: snapshot.id,
      ...snapshot.data(),
    })),
  };
});
