import { Request, Response, NextFunction } from "express";
import { User } from "../model/User";
import { StatusCodes } from "http-status-codes";
import { generateToken, decodeToken } from "../../auth/AuthController";

class UserController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find({});
      res.status(StatusCodes.OK).json({
        status: "success",
        results: users.length,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };
  add = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ...data } = req.body;
      if (req.file) {
        data.imageUrl = {
          data: req.file.originalname,
          contentType: req.file.mimetype,
          fileName: req.file.originalname,
        };
      }
      const userExist = await User.findOne({ email: data.email });
      if (userExist) {
        res.status(StatusCodes.CONFLICT).json({
          status: "false",
          data: {
            message: "Duplicate user!",
          },
        });
      } else {
        const user = await User.create(data);
        res.status(StatusCodes.CREATED).json({
          status: "success",
          data: user,
        });
      }
    } catch (error) {
      next(error);
    }
  };
  check = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send("Email không tồn tại.");
      }
      const isPasswordValid = user.password === password;
      if (!isPasswordValid) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send("Mật khẩu không chính xác.");
      }
      if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: "Bad Request",
          message: "Missing required information: 'email or password'",
        });
      }
      const accessTokenLife: string = "2m";
      const refreshTokenLife: string = "365d";
      const accessTokenSecret: string = "thaibao2004";
      const refreshTokenSecret: string = "thaibao2004refresh";
      const dataForAccessToken = {
        email: user.email,
      };
      const accessToken = await generateToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife
      );
      if (!accessToken) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .send("Đăng nhập không thành công, vui lòng thử lại.");
      }
      let refreshToken = await generateToken(
        dataForAccessToken,
        refreshTokenSecret,
        refreshTokenLife
      );
      if (!user.refreshToken) {
        await User.findOneAndUpdate(
          { email: email },
          { refreshToken: refreshToken }
        );
      } else {
        refreshToken = user.refreshToken;
      }
      if (user.role === "User") {
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          path: "/",
          secure: false,
        });
        res.status(StatusCodes.OK).json({
          success: true,
          data: {
            role: user.role,
            id: user._id,
            accessToken,
            expireIns: Date.now() + 2 * 60 * 1000,
          },
        });
      } else {
        res.cookie("refreshTokenAdmin", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          path: "/",
          secure: false,
        });
        res.status(StatusCodes.CREATED).json({
          success: true,
          data: {
            role: user.role,
            id: user._id,
            accessToken,
            expireIns: Date.now() + 2 * 60 * 1000,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  };
  detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      res.status(StatusCodes.OK).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      req.body.thumb = {
        data: req.file.originalname,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
      };
    }
    try {
      User.create(req.body)
        .then(() => {
          res.status(201).json({
            status: "success",
            message: "Create successfully",
          });
        })
        .catch(next);
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
