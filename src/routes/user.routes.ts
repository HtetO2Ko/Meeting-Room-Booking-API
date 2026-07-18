import { Router } from "express";
import {
  createUser,
  getUsers,
  changeUserRole,
  deleteUser,
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import {
  validateCreateUser,
  validateUpdateRole,
  validateUserIdParam,
} from "../middlewares/user.validation.js";

const router = Router();

router.use(authenticate);

router.use(authorize(["admin"]));

router.post("/", validateCreateUser, createUser);
router.get("/", getUsers);
router.patch("/:id/role", validateUpdateRole, changeUserRole);
router.delete("/:id", validateUserIdParam, deleteUser);

export default router;
