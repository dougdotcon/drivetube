import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Course } from '@/types/course';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/courses/my-courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const createCourse = async (data: Omit<Course, 'id'>) => {
    const response = await api.post('/courses', data);
    setCourses((prev) => [...prev, response.data]);
    return response.data;
  };

  const updateCourse = async (id: string, data: Partial<Course>) => {
    const response = await api.put(`/courses/${id}`, data);
    setCourses((prev) =>
      prev.map((course) => (course.id === id ? response.data : course))
    );
    return response.data;
  };

  const deleteCourse = async (id: string) => {
    await api.delete(`/courses/${id}`);
    setCourses((prev) => prev.filter((course) => course.id !== id));
  };

  return {
    courses,
    isLoading,
    createCourse,
    updateCourse,
    deleteCourse,
  };
} 