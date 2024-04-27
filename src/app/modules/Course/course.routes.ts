import express from 'express';
import { CourseController } from './course.controller';

const router = express.Router();

router.post('/create', CourseController.insertIntoDB);
router.get('/', CourseController.getAllFromDB);
router.get('/:id', CourseController.getByIdFromDB);

/// I intend to explore the update course functionalities in the upcoming module.
//   router.patch(
//     '/:id',
//     validateRequest(CourseValidation.update),
//     auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//     CourseController.updateOneInDB
//   );

router.delete(
  '/:id',
  // auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseController.deleteByIdFromDB
);

export const CourseRoutes = router;
