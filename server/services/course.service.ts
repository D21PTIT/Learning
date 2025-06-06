import { Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";

// create course
export const createCourse = CatchAsyncError(
  async (data: any, res: Response) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  }
);
export const getSingleCourseService = async (courseId: string) => {
  const isCacheExist = await redis.get(courseId);
  if (isCacheExist) {
    return JSON.parse(isCacheExist);
  }

  const course = await CourseModel.findById(courseId).select(
    "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
  );

  if (!course) {
    throw new ErrorHandler("Khóa học không tồn tại", 404);
  }

  await redis.set(courseId, JSON.stringify(course), "EX", 604800);
  return course;
};
export const getCourseByUserService = async (
  userCourses: any[],
  courseId: string
) => {
  const courseExists = userCourses?.find(
    (course: any) => course.courseId.toString() === courseId.toString()
  );

  if (!courseExists) {
    throw new ErrorHandler("Bạn không có quyền truy cập khóa học này", 404);
  }

  const course = await CourseModel.findById(courseId);
  if (!course) {
    throw new ErrorHandler("Khóa học không tồn tại", 404);
  }

  return course.courseData;
};

// Get All Courses
export const getAllCoursesService = async (res: Response) => {
  const courses = await CourseModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    courses,
  });
};
