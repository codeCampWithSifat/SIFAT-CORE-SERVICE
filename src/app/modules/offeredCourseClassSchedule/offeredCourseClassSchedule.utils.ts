import { OfferedCourseClassSchedule, WeekDays } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../shared/prisma';

type IExsitingSlots = {
  startTime: string;
  endTime: string;
  dayOfWeek: WeekDays;
}[];

type INewSlots = {
  startTime: string;
  endTime: string;
  dayOfWeek: WeekDays;
};

const hasTimeConflict = async (
  existingSlots: IExsitingSlots,
  newSlots: INewSlots
) => {
  for (const slot of existingSlots) {
    const existingStart = new Date(`1970-01-01T${slot.startTime}:00`);
    const existingEnd = new Date(`1970-01-01T${slot.endTime}:00`);
    const newStart = new Date(`1970-01-01T${newSlots.startTime}:00`);
    const newEnd = new Date(`1970-01-01T${newSlots.endTime}:00`);

    if (newStart < existingEnd && newEnd > existingStart) {
      //   throw new ApiError(httpStatus.CONFLICT, 'Room Already Booked');
      return true;
    }
  }
  return false;
};

const checkRoomAvailable = async (data: OfferedCourseClassSchedule) => {
  const alreadyBookedRoomOnDay =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: data.dayOfWeek,
        room: {
          id: data.roomId,
        },
      },
    });
  const existingSlots = alreadyBookedRoomOnDay.map(schedule => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));

  const newSlots = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };

  if (
    await OfferedCourseClassScheduleUtils.hasTimeConflict(
      existingSlots,
      newSlots
    )
  ) {
    throw new ApiError(httpStatus.CONFLICT, 'Room Already Booked');
  }
};

const checkFacultyAvailable = async (data: OfferedCourseClassSchedule) => {
  const alreadyFacultyAssigned =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: data.dayOfWeek,
        faculty: {
          id: data.facultyId,
        },
      },
    });

  console.log(alreadyFacultyAssigned, 'already faculty assigned');
  const existingSlots = alreadyFacultyAssigned.map(schedule => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));

  const newSlots = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };

  if (
    await OfferedCourseClassScheduleUtils.hasTimeConflict(
      existingSlots,
      newSlots
    )
  ) {
    throw new ApiError(httpStatus.CONFLICT, 'Faculty Already Booked On Day');
  }
};

export const OfferedCourseClassScheduleUtils = {
  hasTimeConflict,
  checkRoomAvailable,
  checkFacultyAvailable,
};
