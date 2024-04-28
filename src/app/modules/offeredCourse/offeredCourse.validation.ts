import { z } from 'zod';

const create = z.object({
  body: z.object({
    academicDepartmentId: z.string({
      required_error: 'Academic Department is Required',
    }),
    semesterRegistrationId: z.string({
      required_error: 'Semester Registration is Required',
    }),
    courseIds: z.array(z.string({ required_error: 'Course Id is Required' }), {
      required_error: 'course is Required',
    }),
  }),
});

export const OfferedCourseSchemaValidation = {
  create,
};
