import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function loadEnv(): void {
  const filePath = resolve('.env');

  if (!existsSync(filePath)) {
    return;
  }

  const envBuffer = readFileSync(filePath, { encoding: 'utf8' });
  const envLines = envBuffer.split('\n');

  envLines.forEach((line) => {
    const [key, value] = line.split('=').map((part) => part.trim());
    if (key && value && !process.env[key]) {
      process.env[key] = value;
    }
  });
}

export default loadEnv;
