import expres from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseSectioController } from './offeredCourseSection.controller';
import { OfferedCourseSectionValidation } from './offeredCourseSection.validation';

const router = expres.Router();

router.post('/create', OfferedCourseSectioController.insertIntoDB);
router.get('/', OfferedCourseSectioController.getAllFromDB);
router.get('/:id', OfferedCourseSectioController.getSingleDataById);
router.patch(
  '/:id',
  validateRequest(OfferedCourseSectionValidation.update),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseSectioController.updateOneInDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseSectioController.deleteByIdFromDB
);

export const OfferedCourseSectionRoutes = router;
