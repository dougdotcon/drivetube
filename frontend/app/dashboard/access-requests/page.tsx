import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAccessRequests } from '@/hooks/useAccessRequests';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/utils';

export default function AccessRequestsPage() {
  const { toast } = useToast();
  const {
    requests,
    isLoading,
    updateRequestStatus,
  } = useAccessRequests();

  const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await updateRequestStatus(id, status);
      toast({
        title: 'Sucesso',
        description: `Solicitação ${status === 'APPROVED' ? 'aprovada' : 'rejeitada'} com sucesso!`,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar solicitação. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Solicitações de Acesso</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests?.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{request.user.name}</p>
                    <p className="text-sm text-gray-500">{request.user.email}</p>
                  </div>
                </TableCell>
                <TableCell>{request.course.name}</TableCell>
                <TableCell>{formatDate(request.createdAt)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      request.status === 'PENDING'
                        ? 'default'
                        : request.status === 'APPROVED'
                        ? 'success'
                        : 'destructive'
                    }
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>{request.message || '-'}</TableCell>
                <TableCell>
                  {request.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(request.id, 'APPROVED')}
                      >
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateStatus(request.id, 'REJECTED')}
                      >
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 