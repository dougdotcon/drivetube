import { Router } from 'express'
import { listDirectory, getFileDetails, openFile } from '../controllers/fileController'
import { isAuthenticated } from '../middleware/auth'

const router = Router()

router.use(isAuthenticated)

router.get('/list', listDirectory)
router.get('/details', getFileDetails)
router.post('/open', openFile)

export default router 