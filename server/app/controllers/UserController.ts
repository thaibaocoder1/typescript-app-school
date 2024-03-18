import { Request, Response, NextFunction } from "express";
import { User } from "../model/User";
import { StatusCodes } from "http-status-codes";

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
  add = async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      req.body.imageUrl = {
        data: req.file.originalname,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
      };
    }
    try {
      const users = await User.findOne({ email: req.body.email });
      if (users) {
        res.status(409).json({
          status: "failure",
          message: "Conflict when create user",
        });
      } else {
        User.create(req.body)
          .then(() => {
            res.status(201).json({
              status: "success",
              message: "Create successfully",
            });
          })
          .catch(next);
      }
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
