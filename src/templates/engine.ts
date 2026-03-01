import Handlebars from "handlebars";
import fs from 'fs'
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const renderTemplate = (channel: string, name: string, data: Record<string, any>): string => {
    const filePath = path.join(__dirname, channel, `${name}.hbs`)
    const source = fs.readFileSync(filePath, 'utf-8')
    const template = Handlebars.compile(source)
    return template(data)

}


// It's essentially the bridge between your static template files and your live notification data.