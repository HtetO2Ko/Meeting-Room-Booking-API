import { body, param } from "express-validator";
import { handleValidationErrors } from "./validation.middleware.js";

export const validateCreateUser = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "owner", "user"])
    .withMessage("Role must be either 'admin', 'owner', or 'user'"),

  handleValidationErrors,
];

export const validateUpdateRole = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("User ID must be a valid positive integer"),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "owner", "user"])
    .withMessage("Role must be either 'admin', 'owner', or 'user'"),

  handleValidationErrors,
];

export const validateUserIdParam = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("User ID must be a valid positive integer"),

  handleValidationErrors,
];
