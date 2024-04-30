/* eslint-disable @typescript-eslint/no-explicit-any */
import { OfferedCourseSection, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import {
  offeredCourseSectionRelationalFields,
  offeredCourseSectionRelationalFieldsMapper,
} from './offeredCourseSection.constants';
import { IOfferedCourseSectionFilter } from './offeredCourseSection.interface';

const insertIntoDB = async (data: any): Promise<OfferedCourseSection> => {
  const isExistOfferedCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: data.offeredCourseId,
    },
  });

  if (!isExistOfferedCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Offered Course Not Exist');
  }
  data.semesterRegistrationId = isExistOfferedCourse.semesterRegistrationId;
  const result = await prisma.offeredCourseSection.create({
    data: data,
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });

  return result;
};

const getAllFromDB = async (
  options: IPaginationOptions,
  filters: IOfferedCourseSectionFilter
): Promise<IGenericResponse<OfferedCourseSection[]>> => {
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andCoditions = [];

  if (searchTerm) {
    andCoditions.push({
      OR: ['title'].map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCoditions.push({
      AND: Object.keys(filterData).map(key => {
        if (offeredCourseSectionRelationalFields.includes(key)) {
          return {
            [offeredCourseSectionRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.OfferedCourseSectionWhereInput =
    andCoditions.length > 0 ? { AND: andCoditions } : {};
  const result = await prisma.offeredCourseSection.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: 'desc' },
  });
  const total = await prisma.offeredCourseSection.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleDataById = (
  id: string
): Promise<OfferedCourseSection | null> => {
  const result = prisma.offeredCourseSection.findUnique({
    where: {
      id: id,
    },
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });

  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<OfferedCourseSection>
): Promise<OfferedCourseSection> => {
  //update
  const result = await prisma.offeredCourseSection.update({
    where: {
      id,
    },
    data: payload,
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
    },
  });
  return result;
};

const deleteByIdFromDB = async (id: string): Promise<OfferedCourseSection> => {
  const result = await prisma.offeredCourseSection.delete({
    where: {
      id,
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
    },
  });
  return result;
};

export const OfferedCourseSectionService = {
  insertIntoDB,
  getSingleDataById,
  updateOneInDB,
  deleteByIdFromDB,
  getAllFromDB,
};
