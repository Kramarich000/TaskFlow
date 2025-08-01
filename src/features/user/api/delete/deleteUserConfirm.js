import api from '@lib/http';
import { apiResponsesHandler } from '@utils/responsesHandler';

export async function userVerify() {
  return await apiResponsesHandler(() =>
    api.post('/users/delete/confirm-deletion', {}, {}),
  );
}
