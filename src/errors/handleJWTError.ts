import { TErrorSources } from '../interface/error';

const handleJWTError = () => {
  const statusCode = 401;
  const message = 'Invalid token. Please log in again!';
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

export default handleJWTError;
