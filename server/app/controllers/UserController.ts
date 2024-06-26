import { Request, Response, NextFunction } from "express";
import { User } from "../model/User";
import { StatusCodes } from "http-status-codes";
import { generateToken, decodeToken } from "../../auth/AuthController";
import mailer from "../../middleware/mailer";
import bcrypt from "bcrypt";

class UserController {
  // Get all
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
  trash = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.findWithDeleted({ deleted: true }).sort(
        "-createdAt"
      );
      res.status(StatusCodes.OK).json({
        status: "success",
        results: users.length,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };
  // Get one
  detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (user && user !== null) {
        res.status(StatusCodes.OK).json({
          status: "success",
          data: user,
        });
      } else {
        res.status(StatusCodes.OK).json({
          status: "failed",
          data: user,
          message: "User has delete!",
        });
      }
    } catch (error) {
      next(error);
    }
  };
  // Add
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
          data: Buffer.from(""),
          contentType: "Empty Type!",
          fileName: "https://placehold.co/350x350",
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
        let user: any;
        const salt = bcrypt.genSaltSync(10);
        if (data.admin === "true") {
          const hashPassword: string = bcrypt.hashSync("passwordtemp", salt);
          const hashCPassowrd: string = bcrypt.hashSync("passwordtemp", salt);
          data.password = hashPassword;
          data.password_confirmation = hashCPassowrd;
          data.isActive = true;
          user = await User.create(data);
        } else {
          const hashPassword: string = bcrypt.hashSync(data.password, salt);
          const hashCPassowrd: string = bcrypt.hashSync(
            data.password_confirmation,
            salt
          );
          data.password = hashPassword;
          data.password_confirmation = hashCPassowrd;
          user = await User.create(data);
          const content = `<b>Vui lòng click vào đường link này để xác thực việc kích hoạt tài khoản. <a href="http://localhost:5173/active.html?id=${user._id}">Xác thực</a></b>`;
          (await mailer.createTransporter()).sendMail({
            from: "BSmart ADMIN",
            to: user.email,
            subject: "Kích hoạt tài khoản tại hệ thống BSmart ✔",
            text: "Kích hoạt tài khoản tại hệ thống BSmart",
            html: content,
          });
        }
        if (user) {
          res.status(StatusCodes.CREATED).json({
            status: "success",
            data: user,
          });
        } else {
          res.status(StatusCodes.NOT_FOUND).json({
            status: "failed",
            message: "Lỗi khi tạo tài khoản.",
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };
  // Update
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
      if (user) {
        const isValidPassword = await bcrypt.compare(
          old_password,
          user.password
        );
        if (isValidPassword) {
          if (old_password === password) {
            return res.status(StatusCodes.CONFLICT).json({
              success: false,
              message: "Mật khẩu mới không được trùng với mật khẩu cũ.",
            });
          } else {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            const hashCPassword = bcrypt.hashSync(confirm_password, salt);
            await User.findOneAndUpdate(
              { _id: req.params.id },
              { password: hashPassword, password_confirmation: hashCPassword },
              { new: true }
            );
            return res.status(StatusCodes.CREATED).json({
              success: true,
              message: "Đổi mật khẩu thành công",
            });
          }
        } else {
          return res.status(StatusCodes.OK).json({
            success: false,
            message: "Mật khẩu không trùng với hệ thống!",
          });
        }
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: "failed",
          message: "Password not match!!",
        });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "failed",
        message: "ERROR froms server",
      });
    }
  };
  // Delete
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await User.findOneDeleted({ _id: id });
      if (user) {
        await User.deleteOne({ _id: id, deleted: true });
        res.status(StatusCodes.OK).json({
          success: true,
          message: "Remove successfully!",
        });
      } else {
        res.status(StatusCodes.OK).json({
          success: false,
          message: "Remove failed!",
        });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "failed",
        message: "ERROR froms server",
      });
    }
  };
  softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await User.findOne({ _id: id });
      if (user) {
        if (user.role.toLowerCase() === "user") {
          await User.delete({ _id: id });
          res.status(StatusCodes.OK).json({
            success: true,
            message: "Remove successfully!",
          });
        } else {
          res.status(StatusCodes.OK).json({
            success: false,
            message: "Can't remove admin account!",
          });
        }
      } else {
        await User.deleteOne({ _id: id, deleted: true });
        res.status(StatusCodes.OK).json({
          success: true,
          message: "Remove successfully!",
        });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "failed",
        message: "ERROR froms server",
      });
    }
  };
  // Restore
  restore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await User.findOneDeleted({ _id: id });
      if (user) {
        await User.restore({ _id: id });
        res.status(StatusCodes.OK).json({
          success: true,
          message: "Restore successfully!",
        });
      } else {
        res.status(StatusCodes.OK).json({
          success: false,
          message: "Restore failed!",
        });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "failed",
        message: "ERROR froms server",
      });
    }
  };
  // Reset password
  reset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.body;
      const user = await User.findOne({ _id: id });
      if (user) {
        const now = Math.floor(Date.now() / 1000);
        const timer = Math.floor((user?.resetedAt as number) / 1000);
        if (user.resetedAt === 0) {
          res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Account has already reset!",
          });
        } else {
          if (now - timer > 300) {
            res.status(StatusCodes.NOT_FOUND).json({
              success: false,
              message: "Reset failed. Time reset expire!",
            });
          } else {
            req.body.resetedAt = 0;
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(req.body.password, salt);
            const hashCPassword = bcrypt.hashSync(
              req.body.password_confirmation,
              salt
            );
            req.body.password = hashPassword;
            req.body.password_confirmation = hashCPassword;
            await User.findOneAndUpdate({ _id: id }, req.body);
            res.status(StatusCodes.OK).json({
              success: true,
              message: "Reset successfully!",
            });
          }
        }
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Error from SERVER!",
      });
    }
  };
  // Auth
  check = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOneDeleted({ email: email });
      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Tài khoản chưa được kích hoạt.",
        });
      }
      if (user?.deleted) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Tài khoản đã bị xoá",
        });
      }
      const isPasswordValid: boolean = await bcrypt.compare(
        password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Mật khẩu không chính xác.",
        });
      }
      if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: "Bad Request",
          message: "Missing required information: 'email or password'",
        });
      }
      const accessTokenLife: string = <string>process.env.ACCESS_TOKEN_LIFE;
      const refreshTokenLife: string = <string>process.env.REFRESH_TOKEN_LIFE;
      const accessTokenSecret: string = <string>process.env.ACCESS_TOKEN_SECRET;
      const refreshTokenSecret: string = <string>(
        process.env.REFRESH_TOKEN_SECRET
      );
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
          secure: false,
          httpOnly: true,
          path: "/",
          expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRE)),
        });
        res.status(StatusCodes.CREATED).json({
          success: true,
          data: {
            role: user.role,
            id: user._id,
            accessToken,
            expireIns: Date.now() + Number(process.env.ACCESS_TOKEN_LIFE_CLI),
          },
        });
      } else {
        res.cookie("refreshTokenAdmin", refreshToken, {
          secure: false,
          httpOnly: true,
          path: "/",
          expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRE)),
        });
        res.status(StatusCodes.CREATED).json({
          success: true,
          data: {
            role: user.role,
            id: user._id,
            accessToken,
            expireIns: Date.now() + Number(process.env.ACCESS_TOKEN_LIFE_CLI),
          },
        });
      }
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error");
    }
  };
  active = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.body;
      const user = await User.findById({ _id: id });
      const now = Math.floor(Date.now());
      let timeCreated = 0;
      if (user?.createdAt instanceof Date) {
        timeCreated = Math.floor(new Date(user?.createdAt).getTime());
      }
      if (user?.isActive === true) {
        res.status(StatusCodes.OK).json({
          success: true,
          isActive: true,
          message: "Account has already active!",
        });
      } else {
        if (now - timeCreated > 5 * 60 * 1000) {
          await User.deleteOne({ _id: id });
          return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Tài khoản đã hết hạn active.",
          });
        } else {
          const user = await User.findOneAndUpdate(
            { _id: id },
            { isActive: true },
            { new: true }
          );
          res.status(StatusCodes.CREATED).json({
            success: true,
            user,
          });
        }
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
  forgot = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      const content = `<b>Vui lòng click vào đường link này để xác thực việc lấy lại mật khẩu. <a href="http://localhost:5173/update.html?id=${
        user!._id
      }">Xác thực</a></b>`;
      if (user) {
        (await mailer.createTransporter()).sendMail({
          from: "BSmart ADMIN",
          to: user.email,
          subject: "Xác thực việc lấy lại mật khẩu tại BSmart ✔",
          text: "Xác thực việc lấy lại mật khẩu tại BSmart",
          html: content,
        });
        await User.findOneAndUpdate(
          { email },
          { $set: { resetedAt: new Date().getTime() } }
        );
        res.status(StatusCodes.OK).json({
          success: true,
          message: "Kiểm tra email để xác thực",
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
  recover = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const user = await User.findOneDeleted({ email });
      if (user) {
        const salt = bcrypt.genSaltSync(15);
        const hash = bcrypt.hashSync(email, salt);
        const content = `<b>Vui lòng click vào đường link này để xác thực việc khôi phục tài khoản. <a href="http://localhost:5173/confirm.html?id=${user._id}&hash=${hash}">Xác thực</a></b>`;
        (await mailer.createTransporter()).sendMail({
          from: "BSmart ADMIN",
          to: user.email,
          subject: "Xác thực việc khôi phục tài khoản tại BSmart ✔",
          text: "Xác thực việc khôi phục tài khoản tại BSmart",
          html: content,
        });
        await User.findOneAndUpdateDeleted(
          {
            email,
          },
          {
            recoverHashCode: hash,
            timeExpireRecover: Date.now() + 5 * 60 * 1000,
          }
        );
        return res.status(StatusCodes.CREATED).json({
          success: true,
          message: "Kiểm tra email để xác thực",
        });
      } else {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Tài khoản đã bị xoá vĩnh viễn!",
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
  confirm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { hash, id } = req.query;
      const user = await User.findOneDeleted({ _id: id });
      if (user) {
        const match = req.query.hash === user.recoverHashCode;
        const now = Math.floor(Date.now());
        const expireIns = Math.floor(user.timeExpireRecover as number);
        if (match && now < expireIns) {
          await User.restore({
            _id: id,
          });
          await User.findOneAndUpdateDeleted(
            {
              _id: id,
            },
            {
              recoverHashCode: "",
              timeExpireRecover: 0,
            }
          );
          return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Khôi phục tài khoản thành công",
          });
        } else {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Đã hết thời hạn khôi phục tài khoản!",
          });
        }
      } else {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "Không thể khôi phục tài khoản!",
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
      const { refreshToken, refreshTokenAdmin } = req.cookies;
      let token: string = "";
      if (!refreshToken && !refreshTokenAdmin) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "UNAUTHORIZED",
        });
      } else {
        if (refreshToken) token = refreshToken;
        if (refreshTokenAdmin) token = refreshTokenAdmin;
      }
      const accessTokenLife: string = <string>process.env.ACCESS_TOKEN_LIFE;
      const refreshTokenLife: string = <string>process.env.REFRESH_TOKEN_LIFE;
      const accessTokenSecret: string = <string>process.env.ACCESS_TOKEN_SECRET;
      const refreshTokenSecret: string = <string>(
        process.env.REFRESH_TOKEN_SECRET
      );
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
          if (user.role.toLowerCase() === "user") {
            res.cookie("refreshToken", newRefreshToken, {
              secure: false,
              httpOnly: true,
              path: "/",
              expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRE)),
            });
          } else {
            res.cookie("refreshTokenAdmin", newRefreshToken, {
              secure: false,
              httpOnly: true,
              path: "/",
              expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRE)),
            });
          }
          res.status(StatusCodes.CREATED).json({
            success: true,
            data: {
              id: user._id,
              role: user.role,
              accessToken: newAccessToken,
              expireIns: Date.now() + Number(process.env.ACCESS_TOKEN_LIFE_CLI),
            },
          });
        }
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
      }
      if (user?.role.toLowerCase() === "user") {
        res.clearCookie("refreshToken");
        res.status(StatusCodes.OK).json({
          success: true,
          data: user,
        });
      } else {
        res.clearCookie("refreshTokenAdmin");
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
