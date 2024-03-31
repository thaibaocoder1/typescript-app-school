import { Request, Response, NextFunction } from "express";
import { User } from "../model/User";
import { StatusCodes } from "http-status-codes";
import { generateToken, decodeToken } from "../../auth/AuthController";

class UserController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find({}).sort("-createdAt");
      res.status(StatusCodes.OK).json({
        status: "success",
        results: users.length,
        data: users,
      });
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
  add = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ...data } = req.body;
      if (req.file) {
        data.imageUrl = {
          data: req.file.originalname,
          contentType: req.file.mimetype,
          fileName: `http://localhost:8888/uploads/${req.file.originalname}`,
        };
      } else {
        data.imageUrl = {
          data: Buffer.from(data.email),
          contentType: "Empty Type!",
          fileName: req.body.imageUrl,
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
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById({ _id: req.params.id });
      if (!req.file) {
        if (JSON.stringify(req.body) !== JSON.stringify(user!.toObject())) {
          await User.findByIdAndUpdate({ _id: req.params.id }, req.body);
        }
      } else {
        req.body.imageUrl = {
          data: req.file.originalname,
          contentType: req.file.mimetype,
          fileName: `http://localhost:8888/uploads/${req.file.originalname}`,
        };
        await User.findByIdAndUpdate({ _id: req.params.id }, req.body);
      }
      res.status(StatusCodes.CREATED).json({
        status: "success",
        message: "Update successfully",
      });
    } catch (error) {
      next(error);
    }
  };
  updateFields = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById({ _id: req.params.id });
      const { old_password, password, confirm_password } = req.body;
      if (user?.password === old_password) {
        await User.findByIdAndUpdate(
          { _id: req.params.id },
          { password, password_confirmation: confirm_password }
        );
        res.status(StatusCodes.CREATED).json({
          status: "success",
          message: "Change password success!",
        });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "failed",
          message: "Password not match!!",
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
      const accessTokenLife: string = "20m";
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
      res.status(StatusCodes.CREATED).json({
        success: true,
        data: {
          role: user.role,
          id: user._id,
          accessToken,
          refreshToken,
          expireIns: Date.now() + 20 * 60 * 1000,
        },
      });
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
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      if (!token) {
        next();
      }
      const accessTokenLife: string = "20m";
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
              role: user.role,
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
              expireIns: Date.now() + 20 * 60 * 1000,
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
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await User.findById({ _id: id });
      if (!user) {
        res.status(StatusCodes.OK).json({
          success: false,
          data: {
            message: "User not exist to find!",
          },
        });
      } else {
        await User.findOneAndUpdate(
          { _id: id },
          { refreshToken: "" },
          { new: true }
        );
        res.status(StatusCodes.OK).json({
          success: true,
          data: user,
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
}

export const userController = new UserController();
