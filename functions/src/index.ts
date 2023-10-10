/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as logger from 'firebase-functions/logger';
import { onCall } from 'firebase-functions/v2/https';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onCall((request) => {
  const { data } = request;
  logger.info(data, { structuredData: true });
  return {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz',
  };
});

export const slimShady = onCall((request) => {
  console.log('Huuarei', request.data);
  return 'party';
});
