import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';
import { AccessRequestController } from '../controllers/AccessRequestController';
import { authMiddleware } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/role';

const router = Router();
const courseController = new CourseController();
const accessRequestController = new AccessRequestController();

// Rotas para criadores de conteúdo
router.post('/', authMiddleware, roleMiddleware(['CONTENT_CREATOR']), courseController.create);
router.get('/my-courses', authMiddleware, roleMiddleware(['CONTENT_CREATOR']), courseController.list);
router.put('/:id', authMiddleware, roleMiddleware(['CONTENT_CREATOR']), courseController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['CONTENT_CREATOR']), courseController.delete);

// Rotas para solicitações de acesso
router.post('/:courseId/request-access', authMiddleware, accessRequestController.create);
router.get('/access-requests', authMiddleware, roleMiddleware(['CONTENT_CREATOR']), accessRequestController.listForCreator);
router.put('/access-requests/:id/status', authMiddleware, roleMiddleware(['CONTENT_CREATOR']), accessRequestController.updateStatus);

export default router; 