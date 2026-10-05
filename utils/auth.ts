import fs from 'fs';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

export function getApiToken(): string {
  if (!fs.existsSync(authFile)) {
    throw new Error(`Auth file not found: ${authFile}. Did the setup project run?`);
  }
  const authData = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
  return authData.origins[0].localStorage[0].value;
}