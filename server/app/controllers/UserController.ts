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
        res.status(StatusCodes.OK).json({
          success: true,
          data: {
            role: user.role,
            id: user._id,
            accessToken,
            refreshToken,
            expireIns: Date.now() + 2 * 60 * 1000,
          },
        });
      } else {
        res.status(StatusCodes.CREATED).json({
          success: true,
          data: {
            role: user.role,
            id: user._id,
            accessToken,
            refreshToken,
            expireIns: Date.now() + 2 * 60 * 1000,
          },
        });
      }
    } catch (error) {
      next();
    }
  };
  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await User.findById({ _id: id });
      if (user) {
        res.status(StatusCodes.OK).json({
          success: true,
          data: user,
        });
      } else {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Không có tài khoản nào được tìm thấy.",
        });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: {
          message: "Error from SERVER!",
        },
      });
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
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      if (!token) {
        next();
      }
      const accessTokenLife: string = "2m";
      const refreshTokenLife: string = "365d";
      const accessTokenSecret: string = "thaibao2004";
      const refreshTokenSecret: string = "thaibao2004refresh";
      const verifyToken = await decodeToken(token, refreshTokenSecret);
      if (verifyToken) {
        const newAccessToken = await generateToken(
          verifyToken.payload,
          accessTokenSecret,
          accessTokenLife
        );
        const newRefreshToken = await generateToken(
          verifyToken.payload,
          refreshTokenSecret,
          refreshTokenLife
        );
        const user = await User.findOneAndUpdate(
          { email: verifyToken.payload.email },
          {
            refreshToken: newRefreshToken,
          }
        );
        if (user) {
          res.status(StatusCodes.CREATED).json({
            success: true,
            data: {
              id: user._id,
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
              expireIns: Date.now() + 2 * 60 * 1000,
            },
          });
        }
        next();
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: {
          message: "Error from SERVER!",
        },
      });
    }
  };
}

export const userController = new UserController();
