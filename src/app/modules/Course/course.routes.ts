import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validation';

const router = express.Router();

router.post('/create', CourseController.insertIntoDB);
router.get('/', CourseController.getAllFromDB);
router.get('/:id', CourseController.getByIdFromDB);

/// I intend to explore the update course functionalities in the upcoming module.
router.patch(
  '/:id',
  validateRequest(CourseValidation.update),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.updateOneInDB
);

router.delete(
  '/:id',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.deleteByIdFromDB
);

router.post(
  '/:id/assign-faculties',
  validateRequest(CourseValidation.assignOrRemoveFaculties),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.assignFaculies
);

router.delete(
  '/:id/remove-faculties',
  validateRequest(CourseValidation.assignOrRemoveFaculties),
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.removeFaculties
);

export const CourseRoutes = router;
