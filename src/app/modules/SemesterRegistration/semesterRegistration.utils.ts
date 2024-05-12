/* eslint-disable @typescript-eslint/no-explicit-any */
const getAvailableCourses = (
  offeredCourses: any,
  studentCompletedCourse: any,
  studentCurrentSemesterTakenCourses: any
) => {
  //   console.log(
  //     'Offered Courses',
  //     offeredCourse,
  //     'Student Completed',
  //     studentCompletedCourse,
  //     'Student Current Semester Taken',
  //     studentCurrentSemesterTakenCourses
  //   );

  const completedCoursesId = studentCompletedCourse.map(
    (course: any) => course?.courseId
  );

  const availableCoursesList = offeredCourses
    .filter(
      (offeredCourse: any) =>
        !completedCoursesId.includes(offeredCourse?.courseId)
    )
    .filter((course: any) => {
      const preRequisites = course.course?.preRequisite;

      if (preRequisites.length === 0) {
        return true;
      } else {
        const preRequisiteIds = preRequisites.map(
          (preRequisite: any) => preRequisite?.preRequisiteId
        );

        return preRequisiteIds.every((id: string) =>
          completedCoursesId.includes(id)
        );
      }
    })
    .map((course: any) => {
      const isAlreadyTakenCourse = studentCurrentSemesterTakenCourses.find(
        (c: any) => c?.offeredCourseId === course?.id
      );
      if (isAlreadyTakenCourse) {
        course.offeredCourseSections.map((section: any) => {
          if (section.id === isAlreadyTakenCourse.offeredCourseSectionId) {
            section.isTaken = true;
          } else {
            section.isTaken = false;
          }
        });
        return {
          ...course,
          isTaken: true,
        };
      } else {
        course.offeredCourseSections.map((section: any) => {
          section.isTaken = false;
        });
        return {
          ...course,
          isTaken: false,
        };
      }
    });

  // console.log('availableCoursesList', availableCoursesList);

  return availableCoursesList;
};

export const SemesterRegistrationUtils = {
  getAvailableCourses,
};
