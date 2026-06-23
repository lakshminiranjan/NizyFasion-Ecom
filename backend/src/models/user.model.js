import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  streetAddress: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }

});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  addresses: [addressSchema],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);