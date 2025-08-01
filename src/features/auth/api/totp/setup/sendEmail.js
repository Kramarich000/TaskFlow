import api from '@lib/http';
import { apiResponsesHandler } from '@utils/responsesHandler';

export async function sendEmail() {
  return await apiResponsesHandler(
    () => api.post('/auth/totp/confirm-setup', {}, {}),
    {},
  );
}
