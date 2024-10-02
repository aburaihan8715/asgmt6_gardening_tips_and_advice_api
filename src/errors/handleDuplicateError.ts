import { TErrorSources, TGenericErrorResponse } from '../interface/error';

interface IDuplicateError extends Error {
  code?: number;
  keyValue?: Record<string, string>;
}

const handleDuplicateError = (
  err: IDuplicateError,
): TGenericErrorResponse => {
  const message = err.message || 'Duplicate key error';
  const statusCode = 400;
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

export default handleDuplicateError;
