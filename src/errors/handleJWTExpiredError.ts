import { TErrorSources } from '../interface/error';

const handleJWTExpiredError = () => {
  const statusCode = 401;
  const message = 'Your token has expired. Please log in again!';
  const errorMessages: TErrorSources = [
    {
      path: '',
      message,
    },
  ];

  return {
    statusCode,
    message,
    errorMessages,
  };
};

export default handleJWTExpiredError;
