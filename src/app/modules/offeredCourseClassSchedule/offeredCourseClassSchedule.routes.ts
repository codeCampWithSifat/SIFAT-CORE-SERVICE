import express from 'express';
import { OfferedCourseClassScheduleController } from './offeredCourseClassSchedule.controller';

const router = express.Router();

router.get('/', OfferedCourseClassScheduleController.getAllFromDB);
router.post('/create', OfferedCourseClassScheduleController.insertIntoDB);

export const OfferedCourseClassSchedulesRoutes = router;
