import { readFileSync } from 'fs';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface SignJWT {
  userId: string,
  deviceId: string
}

export const signJWT = ({ userId, deviceId }: SignJWT) => {
  const privateKey = readFileSync('private_key.pem');

  const token = jwt.sign({ userId, deviceId }, privateKey, { algorithm: 'RS256' });

  return token;
}

export const validateJWT = async ({ token }: { token: string }) => {
  const publicKey = readFileSync('public_key.pem');

  const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as SignJWT;

  return decoded;
}