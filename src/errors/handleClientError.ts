import { Prisma } from '@prisma/client';
import { IGenericErrorMessage } from '../interfaces/error';

const handleClientError = (error: Prisma.PrismaClientUnknownRequestError) => {
  const errors: IGenericErrorMessage[] = [
    {
      path: 'Prisma Client Error',
      message: error.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Cast Error',
    errorMessages: errors,
  };
};

export default handleClientError;
