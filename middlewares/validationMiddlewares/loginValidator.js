import { check } from 'express-validator';

export const validateUserLogin = [
  check('email', 'Email is required').isEmail().normalizeEmail(),
  check('password', 'Password is required').notEmpty().trim().escape(),
];

export const validateAdminLogin = [
  check('email', 'Email is required').isEmail().trim().escape(),
  check('password', 'Password is required').notEmpty().trim().escape(),
];


