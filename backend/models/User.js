// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nrnId: { type: String, required: true, unique: true },
  faceDescriptor: { type: [Number], default: [] },
  isVerified: { type: Boolean, default: false },
  hasVoted: { type: Boolean, default: false },
}, { timestamps: true });

UserSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// ✅ THIS MUST EXIST
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);