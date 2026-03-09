import { Response } from "express";

export function setAccessTokenCookie(res: Response, token: string) {
  res.cookie("access_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60, // 1h
  });
}

export function clearAccessTokenCookie(res: Response) {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
}
