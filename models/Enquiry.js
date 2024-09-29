import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    workno: {
      type: String,
      required: true,
      unique: true,
    },
    EnqiryName: {
      type: String,
      required: true,
    },
    EnqiryDetails: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    throghAgent: {
      type: Boolean,
      default: false,
    },
    AgentName: {
      type: String,
    },
    AgentNo: {
      type: Number,
    },
    AgentEmail: {
      type: String,
    },
    CustomerName: {
      type: String,
    },
    CustomerNumber: {
      type: Number,
    },
    CustomerEmail: {
      type: String,
    },
    CustomerAddress: {
      type: String,
    },
    remark: {
      type: String,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
const Enquiry = mongoose.model("Enquiry", enquirySchema);
export default Enquiry;
