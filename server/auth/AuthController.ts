import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { User } from "../app/model/User";

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

export const generateToken = async (
  payload: any,
  secretSignature: string,
  tokenLife: string | number
) => {
  try {
    return await sign(
      {
        payload,
      },
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      }
    );
  } catch (error) {
    console.log(`Error in generate access token: ${error}`);
    return null;
  }
};

export const decodeToken = async (token: string, secretKey: string) => {
  try {
    return await verify(token, secretKey, {
      ignoreExpiration: true,
    });
  } catch (error) {
    console.log(`Error in decode access token: ${error}`);
    return null;
  }
};

export const verifyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken, refreshTokenAdmin } = req.cookies;
  let token: string = "";
  if (!refreshToken && !refreshTokenAdmin) {
    token = "";
  } else {
    if (refreshToken && !refreshTokenAdmin) {
      token = refreshToken;
    } else if (!refreshToken && refreshTokenAdmin) {
      token = refreshTokenAdmin;
    } else {
      token = "";
    }
  }
  if (token === "") {
    next();
  } else {
    const refreshTokenSecret: string = <string>process.env.REFRESH_TOKEN_SECRET;
    const verifyToken = await decodeToken(token, refreshTokenSecret);
    if (verifyToken) {
      const { payload } = verifyToken;
      const user = await User.findOneDeleted({ email: payload.email });
      if (user && user.deleted) {
        if (user.role.toLowerCase() === "user") {
          res.clearCookie("refreshToken");
        } else {
          res.clearCookie("refreshTokenAdmin");
        }
      }
      next();
    }
  }
};
