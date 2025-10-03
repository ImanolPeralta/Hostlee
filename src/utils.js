import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

export const __dirname = dirname(fileURLToPath(import.meta.url));

const saltRounds = 10;

export const hashPassword = (plain) => bcrypt.hashSync(plain, saltRounds);
export const verifyPassword = (plain, hash) => bcrypt.compareSync(plain, hash);