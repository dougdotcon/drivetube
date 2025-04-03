export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Course {
  id: string;
  name: string;
  description?: string;
  price?: number;
  status: CourseStatus;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    enrollments: number;
    accessRequests: number;
  };
}

export interface AccessRequest {
  id: string;
  userId: string;
  courseId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  message?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
  };
  course: {
    name: string;
  };
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
} 