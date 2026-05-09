import { createCipheriv, createDecipheriv } from 'crypto';

const MAIN_KEY = Buffer.from('Yg&tc%DEuh6%Zc^8');
const MAIN_IV = Buffer.from('6oyZDr22E3ychjM%');

export function aesCbcEncrypt(text: Buffer): Buffer {
    const cipher = createCipheriv('aes-128-cbc', MAIN_KEY, MAIN_IV);
    return Buffer.concat([cipher.update(text), cipher.final()]);
}

export function aesCbcDecrypt(data: Buffer): Buffer {
    const decipher = createDecipheriv('aes-128-cbc', MAIN_KEY, MAIN_IV);
    return Buffer.concat([decipher.update(data), decipher.final()]);
}
