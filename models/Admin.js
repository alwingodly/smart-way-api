import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  personalPassword: {
    type: Boolean,
    default: false,
  },
  admin:{
    type:Boolean,
    default:true
  }
}, { timestamps: true });


const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
