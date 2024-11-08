import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadEnv(): void {
  const filePath = resolve('.env');
  try {
    const envBuffer = readFileSync(filePath, { encoding: 'utf8' });
    const envLines = envBuffer.split('\n');

    envLines.forEach((line) => {
      const [key, value] = line.split('=').map((part) => part.trim());
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    });

    if (!process.env.MONGO_URI) {
      process.exit(1);
    }
  } catch {
    process.exit(1);
  }
}

export default loadEnv;
