/* eslint-disable @typescript-eslint/no-explicit-any */
import { OfferedCourseClassSchedule, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import {
  offeredCourseClassScheduleRelationalFields,
  offeredCourseClassScheduleRelationalFieldsMapper,
} from './offeredCourseClassSchedule.constants';
import { IOfferedCourseClassScheduleFilter } from './offeredCourseClassSchedule.interface';
import { OfferedCourseClassScheduleUtils } from './offeredCourseClassSchedule.utils';

// const insertIntoDB = async (
//   data: OfferedCourseClassSchedule
// ): Promise<OfferedCourseClassSchedule> => {
//   const alreadyBookedRoomOnDay =
//     await prisma.offeredCourseClassSchedule.findMany({
//       where: {
//         dayOfWeek: data.dayOfWeek,
//         room: {
//           id: data.roomId,
//         },
//       },
//     });
//   const existingSlots = alreadyBookedRoomOnDay.map(schedule => ({
//     startTime: schedule.startTime,
//     endTime: schedule.endTime,
//     dayOfWeek: schedule.dayOfWeek,
//   }));

//   const newSlots = {
//     startTime: data.startTime,
//     endTime: data.endTime,
//     dayOfWeek: data.dayOfWeek,
//   };

//   for (const slot of existingSlots) {
//     const existingStart = new Date(`1970-01-01T${slot.startTime}:00`);
//     const existingEnd = new Date(`1970-01-01T${slot.endTime}:00`);
//     const newStart = new Date(`1970-01-01T${newSlots.startTime}:00`);
//     const newEnd = new Date(`1970-01-01T${newSlots.endTime}:00`);

//     if (newStart < existingEnd && newEnd > existingStart) {
//       throw new ApiError(httpStatus.CONFLICT, 'Room Already Booked');
//     }
//   }

//   // existing 12:30 - 13:30;
//   // new Slot 12:50 - 13:50

//   const result = await prisma.offeredCourseClassSchedule.create({
//     data,
//     include: {
//       offeredCourseSection: true,
//       semesterRegistration: true,
//       room: true,
//       faculty: true,
//     },
//   });
//   return result;
// };

const insertIntoDB = async (
  data: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule> => {
  await OfferedCourseClassScheduleUtils.checkRoomAvailable(data);
  await OfferedCourseClassScheduleUtils.checkFacultyAvailable(data);

  // existing 12:30 - 13:30;
  // new Slot 12:50 - 13:50

  const result = await prisma.offeredCourseClassSchedule.create({
    data,
    include: {
      offeredCourseSection: true,
      semesterRegistration: true,
      room: true,
      faculty: true,
    },
  });
  return result;
};

const getAllFromDB = async (
  filters: IOfferedCourseClassScheduleFilter,
  options: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseClassSchedule[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: ['dayOfWeek', 'startTime'].map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (offeredCourseClassScheduleRelationalFields.includes(key)) {
          return {
            [offeredCourseClassScheduleRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.OfferedCourseClassScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.offeredCourseClassSchedule.findMany({
    include: {
      faculty: true,
      semesterRegistration: true,
      room: true,
      offeredCourseSection: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.offeredCourseClassSchedule.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (
  id: string
): Promise<OfferedCourseClassSchedule | null> => {
  const result = await prisma.offeredCourseClassSchedule.findUnique({
    where: {
      id,
    },
    include: {
      offeredCourseSection: true,
      faculty: true,
      room: true,
    },
  });
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<OfferedCourseClassSchedule>
): Promise<OfferedCourseClassSchedule> => {
  const result = await prisma.offeredCourseClassSchedule.update({
    where: {
      id,
    },
    data: payload,
    include: {
      offeredCourseSection: true,
      faculty: true,
      room: true,
    },
  });
  return result;
};

const deleteByIdFromDB = async (
  id: string
): Promise<OfferedCourseClassSchedule> => {
  const result = await prisma.offeredCourseClassSchedule.delete({
    where: {
      id,
    },
    include: {
      offeredCourseSection: true,
      faculty: true,
      room: true,
    },
  });
  return result;
};

export const OfferedCourseClassSchedulesService = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
};
