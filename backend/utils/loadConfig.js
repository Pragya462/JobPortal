import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, '..', 'config', 'config.json');
export let config = {}

const loadConfig = () => {
    try{
        if (fs.existsSync(configPath)) {
            const configData = fs.readFileSync(configPath, 'utf-8');
            Object.assign(config, JSON.parse(configData));
        } else {
            console.error('Config file not found:', configPath);
        }
    }
    catch (error) {
        console.error('Error loading config:', error);
    }
    return config;
}

config = loadConfig();
console.log('Config loaded:', config.database); 