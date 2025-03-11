import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { AccessRequest } from '@/types/course';

export function useAccessRequests() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/courses/access-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateRequestStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const response = await api.put(`/courses/access-requests/${id}/status`, { status });
    setRequests((prev) =>
      prev.map((request) => (request.id === id ? response.data : request))
    );
    return response.data;
  };

  return {
    requests,
    isLoading,
    updateRequestStatus,
  };
} 