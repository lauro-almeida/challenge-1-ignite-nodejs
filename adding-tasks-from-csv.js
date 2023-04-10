import fs from 'fs'
import { parse } from 'csv-parse'

import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const processFile = async () => {
    const parser = fs.createReadStream(`${__dirname}/tasks.csv`).pipe(parse())

    let counter = 0
    for await (const task of parser) {
        if (counter > 0) {
            const body = `{"title": "${task[0]}", "description": "${task[1]}"}`

            await fetch('http://localhost:3333/tasks', {
                method: 'POST',
                body: body,
            })
        }
        counter++
    }
}

processFile()
