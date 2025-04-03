import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import courseRoutes from './routes/courseRoutes'
import fileRoutes from './routes/fileRoutes'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/files', fileRoutes)

export default app 