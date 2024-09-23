const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true, // Trims whitespace
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true, // Index added
    },
    password: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: Number,
      required: true,
    },
    whatsappNumber: {
        type: Number,
     
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiry: {
      type: Date,
    },
    roles: {
      type: [{
        type: String,
        enum: ['user', 'admin'],
      }],
      default: ['user'],
    },
    
    workFlow: [
      {
        type: Schema.Types.ObjectId,
        ref: "WorkFlow",
      },
    ],
    purchaseHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "PurchaseHistory",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
