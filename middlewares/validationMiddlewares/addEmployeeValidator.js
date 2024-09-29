import { check } from 'express-validator';

export const validateAddEmployee = [
    check('name', 'name is required').notEmpty().trim().escape(),
    check('employeeId', 'employee ID is required').notEmpty().trim().escape(),
    check('email', 'Email is required').isEmail().trim().escape(),
    check('password', 'Password is required').notEmpty().trim().escape(),
    check('department', 'department is required').notEmpty().trim().escape(),
  ];