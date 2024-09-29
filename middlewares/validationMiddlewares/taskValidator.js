import { check } from 'express-validator';

export const validateAddEnquiry = [
    check('paymentStatus', 'paymentStatus is required').notEmpty().trim().escape(),
    check('status', 'status is required').notEmpty().trim().escape(),
    check('EnqiryName', 'EnqiryName is required').notEmpty().trim().escape(),
  ];