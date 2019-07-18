import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlERT = (msg, alertType) => dispath => {
  const id = uuid.v4();
  dispath({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });
};
