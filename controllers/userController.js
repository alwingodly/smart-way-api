import Enquiry from "../models/Enquiry.js";
import User from "../models/User.js";
import logger from "../utils/logger.js";
import { handleValidationErrors } from "../utils/validationUtils.js";

export const addEnquiry = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  try {
    const {
      EnqiryName,
      EnqiryDetails,
      status,
      paymentStatus,
      throghAgent,
      AgentName,
      AgentNo,
      AgentEmail,
      remark,
      CustomerName,
      CustomerNumber,
      CustomerEmail,
      CustomerAddress,
    } = req.body;
    console.log(req.body);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { department, employeeId } = user;
    const enquiryCount = await Enquiry.countDocuments();
    const workno = `${department}${employeeId}${String(
      enquiryCount + 1
    ).padStart(4, "0")}`;

    const enquiryData = {
      workno,
      EnqiryName,
      status,
      paymentStatus,
      throghAgent,
      remark,
      EnqiryDetails,
    };

    if (throghAgent) {
      enquiryData.AgentName = AgentName;
      enquiryData.AgentNo = AgentNo;
      enquiryData.AgentEmail = AgentEmail;
    } else {
      enquiryData.CustomerName = CustomerName;
      enquiryData.CustomerNumber = CustomerNumber;
      enquiryData.CustomerEmail = CustomerEmail;
      enquiryData.CustomerAddress = CustomerAddress;
    }

    const newEnquiry = new Enquiry(enquiryData);
    const savedEnquiry = await newEnquiry.save();

    user.enquires.push(savedEnquiry._id);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Enquiry added successfully",
      error: false,
    });
  } catch (error) {
    logger.error("Failed to add enquiry", {
      error: error.message,
      stack: error.stack,
      userId: req.user.id,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to add enquiry",
      error: error.message,
    });
  }
};

export const getUserEnquiries = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("enquires");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "Login successful",
      data: {
        enquiries: user.enquires,
      },
    });
  } catch (error) {
    logger.error("Failed to fetch enquiries", error);
    res.status(500).json({
      message: "Failed to fetch enquiries",
      error: error.message,
    });
  }
};

export const getEnquiry = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('enquires'); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const enquiryId = req.params.id;
    const enquiryExists = user.enquires.some(enquiry => enquiry._id.toString() === enquiryId);

    if (!enquiryExists) {
      return res.status(404).json({ message: "Enquiry not found in user enquiries" });
    }

    const enquiry = user.enquires.find(enquiry => enquiry._id.toString() === enquiryId);
    
    res.status(200).json({
      success: true,
      error: false,
      message: "Enquiry fetched successfully",
      data: {
        enquiry:enquiry, 
      },
    });
  } catch (error) {
    logger.error("Failed to fetch enquiries", error);
    res.status(500).json({
      message: "Failed to fetch enquiries",
      error: error.message,
    });
  }
};

export const editEnquiry = async (req, res) => {
  const validationError = handleValidationErrors(req, res);
  if (validationError) return;

  try {
    const {
      id,
      EnqiryName,
      EnqiryDetails,
      status,
      paymentStatus,
      throghAgent,
      AgentName,
      AgentNo,
      AgentEmail,
      remark,
      CustomerName,
      CustomerNumber,
      CustomerEmail,
      CustomerAddress,
    } = req.body;

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    enquiry.EnqiryName = EnqiryName || enquiry.EnqiryName;
    enquiry.EnqiryDetails = EnqiryDetails || enquiry.EnqiryDetails;
    enquiry.status = status || enquiry.status;
    enquiry.paymentStatus = paymentStatus || enquiry.paymentStatus;
    enquiry.remark = remark || enquiry.remark;

    if (throghAgent) {
      enquiry.CustomerName = null;
      enquiry.CustomerNumber = null;
      enquiry.CustomerEmail = null;
      enquiry.CustomerAddress = null;
      enquiry.throghAgent = true;

      enquiry.AgentName = AgentName || enquiry.AgentName;
      enquiry.AgentNo = AgentNo || enquiry.AgentNo;
      enquiry.AgentEmail = AgentEmail || enquiry.AgentEmail;
    } else {
      enquiry.AgentName = null;
      enquiry.AgentNo = null;
      enquiry.AgentEmail = null;
      enquiry.throghAgent = false;

      enquiry.CustomerName = CustomerName || enquiry.CustomerName;
      enquiry.CustomerNumber = CustomerNumber || enquiry.CustomerNumber;
      enquiry.CustomerEmail = CustomerEmail || enquiry.CustomerEmail;
      enquiry.CustomerAddress = CustomerAddress || enquiry.CustomerAddress;
    }

    const updatedEnquiry = await enquiry.save();

    return res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      data: {
        enquiry:updatedEnquiry
      },
    });
  } catch (error) {
    logger.error("Failed to update enquiry", {
      error: error.message,
      stack: error.stack,
      userId: req.user.id,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to update enquiry",
      error: error.message,
    });
  }
};


