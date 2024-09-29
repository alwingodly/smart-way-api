import User from "../models/User.js";
import logger from "../utils/logger.js";
import { handleValidationErrors } from "../utils/validationUtils.js";
import bcrypt from "bcrypt";

export const addEmployee = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  const { name, email, password, department, employeeId } = req.body;
  try {
    const [existingEmailUser, existingEmployeeIdUser] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ employeeId }),
    ]);

    if (existingEmailUser) {
      logger.warn(
        `Attempt to register with an already existing email: ${email}`
      );
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
        error: true,
      });
    }

    if (existingEmployeeIdUser) {
      logger.warn(
        `Attempt to register with an already existing employeeId: ${employeeId}`
      );
      return res.status(409).json({
        success: false,
        message: "User with this employee ID already exists",
        error: true,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new User({
      name,
      email,
      password: hashedPassword,
      department,
      employeeId,
    });
    await newEmployee.save();

    logger.info(`New employee added: ${name} (${email})`);

    return res.status(201).json({
      success: true,
      message: "Employee added successfully",
      error: false,
    });
  } catch (error) {
    logger.error("Error while adding employee:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const users = await User.find().populate("enquires");
    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }

    const statuses = ["Pending", "Started", "Completed", "Hold", "Rejected"];

    const usersWithStatusCounts = users.map((user) => {
      const statusCounts = statuses.reduce((acc, status) => {
        acc[status] = 0;
        return acc;
      }, {});

      user.enquires.forEach((enquiry) => {
        if (statusCounts[enquiry.status] !== undefined) {
          statusCounts[enquiry.status]++;
        }
      });

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        department: user.department,
        statusCounts: statusCounts,
      };
    });

    res.status(200).json({
      success: true,
      error: false,
      message:
        "Users and individual enquiry status counts fetched successfully",
      data: {
        employees: usersWithStatusCounts,
      },
    });
  } catch (error) {
    logger.error("Failed to fetch users and enquiries", error);
    res.status(500).json({
      message: "Failed to fetch users and enquiries",
      error: error.message,
    });
  }
};

export const deleteEmployees = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedEmployee = await User.findOneAndDelete(userId);
    console.log(deletedEmployee);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    logger.error("Failed to delete employee", error);
    res.status(500).json({
      message: "Failed to delete employee",
      error: error.message,
    });
  }
};

export const getEmployeeDetails = async (req, res) => {
  try {
    const userId = req.params.employeeId;
    const Employee = await User.findOne({ employeeId: userId }).populate('enquires');;
    const SanitizedEmployeeDetails = {
      name: Employee.name,
      email: Employee.email,
      employeeId: Employee.employeeId,
      department: Employee.department,
    };
    const SanitizedEmployeeEnquiries = {
      enquires: Employee.enquires,
    };
    console.log(userId, Employee, "getEmployeeDetails");
    if (!Employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({
      success: true,
      error: false,
      message: "get Employee details successfully",
      data: {
        employeeDetails: SanitizedEmployeeDetails,
        employeeEnquires:SanitizedEmployeeEnquiries
      },
    });
  } catch (error) {
    logger.error("Failed to get employee details", error);
    res.status(500).json({
      message: "Failed to get employee details",
      error: error.message,
    });
  }
};
