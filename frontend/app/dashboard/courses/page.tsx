import React from 'react';
import { CourseCard } from '@/components/CourseCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CourseForm } from '@/components/CourseForm';
import { useCourses } from '@/hooks/useCourses';
import { useToast } from '@/components/ui/use-toast';

export default function CoursesPage() {
  const { toast } = useToast();
  const {
    courses,
    isLoading,
    createCourse,
    updateCourse,
    deleteCourse,
  } = useCourses();

  const handleCreateCourse = async (data: any) => {
    try {
      await createCourse(data);
      toast({
        title: 'Sucesso',
        description: 'Curso criado com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar curso. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateCourse = async (id: string, data: any) => {
    try {
      await updateCourse(id, data);
      toast({
        title: 'Sucesso',
        description: 'Curso atualizado com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar curso. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await deleteCourse(id);
      toast({
        title: 'Sucesso',
        description: 'Curso excluído com sucesso!',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir curso. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meus Cursos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Criar Novo Curso</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Curso</DialogTitle>
            </DialogHeader>
            <CourseForm onSubmit={handleCreateCourse} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isCreator
            onEdit={() => {
              // Implementar edição
            }}
            onDelete={() => handleDeleteCourse(course.id)}
          />
        ))}
      </div>
    </div>
  );
} 