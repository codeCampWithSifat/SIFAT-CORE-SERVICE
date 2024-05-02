export type ISemesterRegistrationFilterRequest = {
  searchTerm?: string | undefined;
  academicSemesterId?: string | undefined;
};

export type IEnrollIntoCourse = {
  offeredCourseId: string;
  offeredCourseSectionId: string;
};
