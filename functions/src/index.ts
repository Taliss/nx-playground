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
const db = getFirestore();

type ConnectConsumer = { powerSupplyId: string; consumerId: string };

export const connectConsumer = onCall<ConnectConsumer, unknown>((request) => {
  // const { powerSupplyId, consumerId } = request.data;
  return db.listCollections().then((collections) => {
    return collections.map(({ id }) => id);
  });
});
