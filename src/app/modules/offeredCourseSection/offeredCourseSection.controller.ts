import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseSectionService } from './offeredCourseSection.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseSectionService.insertIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Section Service Created Successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const filters = pick(req.query, [
    'searchTerm',
    'offeredCourseId',
    'semesterRegistrationId',
  ]);
  const result = await OfferedCourseSectionService.getAllFromDB(
    options,
    filters
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Section Retrived Data Get Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleDataById = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseSectionService.getSingleDataById(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course Section Single Data Get Successfully',
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseSectionService.updateOneInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OfferedCourseSection updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseSectionService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OfferedCourseSection deleted successfully',
    data: result,
  });
});

export const OfferedCourseSectioController = {
  insertIntoDB,
  getSingleDataById,
  updateOneInDB,
  deleteByIdFromDB,
  getAllFromDB,
};
