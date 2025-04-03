import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Course } from '@/types/course';

interface CourseCardProps {
  course: Course;
  onRequestAccess?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isCreator?: boolean;
}

export function CourseCard({
  course,
  onRequestAccess,
  onEdit,
  onDelete,
  isCreator = false,
}: CourseCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{course.name}</CardTitle>
          <Badge variant={course.status === 'PUBLISHED' ? 'default' : 'secondary'}>
            {course.status}
          </Badge>
        </div>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {course.price && (
          <p className="text-lg font-semibold">
            R$ {course.price.toFixed(2)}
          </p>
        )}
        {isCreator && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-500">
              Solicitações: {course._count?.accessRequests || 0}
            </p>
            <p className="text-sm text-gray-500">
              Alunos matriculados: {course._count?.enrollments || 0}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {isCreator ? (
          <>
            <Button variant="outline" onClick={onEdit}>
              Editar
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Excluir
            </Button>
          </>
        ) : (
          <Button onClick={onRequestAccess}>
            Solicitar Acesso
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 