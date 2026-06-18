import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import * as usersService from "../services/users.service";

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  await usersService.deleteAccount(req.user!.id);
  res.status(200).json({ message: "Account scheduled for deletion." });
});
