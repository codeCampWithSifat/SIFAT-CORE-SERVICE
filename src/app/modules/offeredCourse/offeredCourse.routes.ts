import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseController } from './offeredCourse.controller';
import { OfferedCourseSchemaValidation } from './offeredCourse.validation';

const router = express.Router();

router.post(
  '/create',
  validateRequest(OfferedCourseSchemaValidation.create),
  //   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseController.insertIntoDB
);

export const OfferdCourseRoutes = router;
