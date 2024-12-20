const crypto = require("crypto");
const redis = require("../config/redis");

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const saveOtp = async (keys, otp, ttl) => {
  await redis.set(keys, otp, "EX", ttl);
  return otp;
};

const validateOTP = async (key, inputOTP) => {
  const storedOTP = await redis.get(key);
  if (!storedOTP || storedOTP !== inputOTP) return false;
  await redis.del(key);
  return true;
};

module.exports = {
  saveOtp,
  validateOTP,
  generateOTP
};
