import jwt from "jsonwebtoken";

export function generateAccessToken(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
  });
}

export function generateRefreshToken(payload: any) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET as string);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
}
