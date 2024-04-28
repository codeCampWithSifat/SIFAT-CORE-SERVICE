import expres from 'express';
import { OfferedCourseSectioController } from './offeredCourseSection.controller';

const router = expres.Router();

router.post('/create', OfferedCourseSectioController.insertIntoDB);

export const OfferedCourseSectionRoutes = router;
