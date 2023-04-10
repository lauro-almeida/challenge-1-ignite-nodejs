import fs from 'node:fs/promises'

// Caminho relativo para o arquivo de banco de dados
const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf-8').then(data => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            this.#persist()
        })
    }

    // Método para persistir os dados no banco de dados
    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }
         this.#persist()
    }

    select(table, search) {
        let data = this.#database[table] ?? []

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }

        return data
    }

    validateId(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        const isAValidId = rowIndex > -1 ? true : false
        
        return isAValidId
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        
        if (rowIndex > -1) {
            const { title, description } = data
            const now = new Date()

            if (title && description) {
                this.#database[table][rowIndex].title = title
                this.#database[table][rowIndex].description = description
            }
            
            if (title && !description) {
                this.#database[table][rowIndex].title = title
            }
            
            if (!title && description) {
                this.#database[table][rowIndex].description = description
            }
            
            this.#database[table][rowIndex].updated_at = now
            this.#persist()
            return true
        }

        return false
    }
    
    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    updateTaskStatus(id) {
        const rowIndex = this.#database["tasks"].findIndex(row => row.id === id)

        const isTaskCompleted = this.#database["tasks"][rowIndex].completed_at
        const now = new Date()

        if (isTaskCompleted) {
            this.#database["tasks"][rowIndex].completed_at = null
        } else {
            this.#database["tasks"][rowIndex].completed_at = now
        }
    }


    




}