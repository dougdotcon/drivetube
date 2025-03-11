import { Request, Response } from 'express'
import * as fs from 'fs/promises'
import * as path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface FileSystemItem {
  name: string
  path: string
  type: 'file' | 'directory'
  size?: number
  lastModified?: Date
  extension?: string
}

export const listDirectory = async (req: Request, res: Response) => {
  try {
    const directoryPath = req.query.path as string || '/'
    const items: FileSystemItem[] = []

    const entries = await fs.readdir(directoryPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(directoryPath, entry.name)
      const stats = await fs.stat(fullPath)

      const item: FileSystemItem = {
        name: entry.name,
        path: fullPath,
        type: entry.isDirectory() ? 'directory' : 'file',
        size: entry.isFile() ? stats.size : undefined,
        lastModified: stats.mtime,
        extension: entry.isFile() ? path.extname(entry.name).slice(1) : undefined
      }

      items.push(item)
    }

    const parentPath = path.dirname(directoryPath)

    res.json({
      items,
      currentPath: directoryPath,
      parentPath: parentPath !== directoryPath ? parentPath : null
    })
  } catch (error) {
    console.error('Erro ao listar diretório:', error)
    res.status(500).json({ error: 'Erro ao listar diretório' })
  }
}

export const getFileDetails = async (req: Request, res: Response) => {
  try {
    const filePath = req.query.path as string

    const stats = await fs.stat(filePath)
    const item: FileSystemItem = {
      name: path.basename(filePath),
      path: filePath,
      type: stats.isDirectory() ? 'directory' : 'file',
      size: stats.isFile() ? stats.size : undefined,
      lastModified: stats.mtime,
      extension: stats.isFile() ? path.extname(filePath).slice(1) : undefined
    }

    res.json(item)
  } catch (error) {
    console.error('Erro ao obter detalhes do arquivo:', error)
    res.status(500).json({ error: 'Erro ao obter detalhes do arquivo' })
  }
}

export const openFile = async (req: Request, res: Response) => {
  try {
    const { path: filePath } = req.body

    if (process.platform === 'win32') {
      await execAsync(`start "" "${filePath}"`)
    } else if (process.platform === 'darwin') {
      await execAsync(`open "${filePath}"`)
    } else {
      await execAsync(`xdg-open "${filePath}"`)
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Erro ao abrir arquivo:', error)
    res.status(500).json({ error: 'Erro ao abrir arquivo' })
  }
} 