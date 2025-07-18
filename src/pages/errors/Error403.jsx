import { IoHandLeft } from 'react-icons/io5';

import ErrorPage from '@common/ui';

export const Error403 = () => {
  return (
    <ErrorPage
      errorTitle="403"
      errorMessage="У вас нет прав для доступа к этой странице."
      errorHint=""
      errorIcon={<IoHandLeft />}
    />
  );
};
