import { Prisma } from '@prisma/client';
import { IGenericErrorResponse } from '../interfaces/common';

const handleValidationError = (
  error: Prisma.PrismaClientValidationError
): IGenericErrorResponse => {
  const errors = [
    {
      path: 'Something Went Wrong',
      message: error.message,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error Prisma',
    errorMessages: errors,
  };
};

export default handleValidationError;
