/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';

export const asyncForEach = async (array: any[], callback: any) => {
  if (!Array.isArray(array)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Expected An Array Format Data');
  }

  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
