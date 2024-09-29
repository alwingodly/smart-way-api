import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  personalPassword: {
    type: Boolean,
    default: false,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  block:{
    type: Boolean,
    default: false,
  },
  enquires: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enquiry',
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
