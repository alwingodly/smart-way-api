import express from 'express';
import { validateAddEmployee } from '../middlewares/validationMiddlewares/addEmployeeValidator.js';
import { addEmployee, deleteEmployees, getEmployeeDetails, getEmployees } from '../controllers/adminController.js';
import { authenticateToken } from '../middlewares/authMiddileware/authMiddleware.js';
const router = express.Router();

router.post('/addEmployee',authenticateToken,validateAddEmployee, addEmployee);
router.get('/getEmployees', authenticateToken,getEmployees)
router.delete('/deleteEmployees/:id', authenticateToken,deleteEmployees)
router.get('/getEmployeeDetails/:employeeId', authenticateToken,getEmployeeDetails)

export default router;
