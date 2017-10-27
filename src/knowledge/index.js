import { readFileSync } from 'fs';
import { join } from 'path';

export const dict = readFileSync(join(__dirname, 'hello.txt'), 'utf8');

export const dict = readFileSync(join(__dirname, 'hello.txt'), 'utf8');
