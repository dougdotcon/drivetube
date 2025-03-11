import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const roleMiddleware = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.user;

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ error: 'Acesso não autorizado' });
    }

    next();
  };
}; 