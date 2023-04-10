import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from 'node:crypto'

const database = new Database

export const routes = [
    {   // Criação de tarefas
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title=null, description=null } = req.body

            if (title && description) {
                const task = {
                    id: randomUUID(),
                    title,
                    description,
                    completed_at: null,
                    created_at: new Date(),
                    updated_at: new Date()
                }
    
                database.insert('tasks', task)
    
                return res.writeHead(201).end()
            }

            return res.writeHead(404).end()
        }
    }, 
    {   // Listagem de tarefas
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query
        

            const tasks = database.select('tasks', search ? {
                title: search, 
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {   //Atualização de tarefa
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title=null, description=null } = req.body 

            if (!title && !description) {
                return res.writeHead(422).end()
            }

           const isAValidTask = database.validateId('tasks', id)


            if (isAValidTask) {
                database.update('tasks', id, {
                    title,
                    description
                })
                return res.writeHead(204).end()
            }

            return res.writeHead(404).end()
        }
    },
    {   // Remoção de tarefa
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const isAValidTask = database.validateId('tasks', id)
            
            if (isAValidTask) {
                database.delete('tasks', id)
                return res.writeHead(204).end()
            }
            
            return res.writeHead(404).end()
        }
    },
    {   // Alterar status da tarefa
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params
            
            const isAValidTask = database.validateId('tasks', id)
            
            if(isAValidTask) {
                database.updateTaskStatus(id)
                return res.writeHead(204).end()
            }

            return res.writeHead(404).end()
        }
    },
]