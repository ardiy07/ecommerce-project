const { sendOTPEmail } = require("../helpers/emailHelper");
const { saveOtp, validateOTP, generateOTP } = require("../helpers/otpHelper");
const { User, sequelize } = require("../models");
const bcrypt = require("bcryptjs");

const sendOtpToEmail = async (email) => {
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const otp = generateOTP();
    await saveOtp(`otp:${email}`, otp, 300);

    await sendOTPEmail(email, otp);

    return { message: "OTP sent to email" };
  } catch (error) {
    throw new Error(error.message || "Something went wrong during OTP sending");
  }
};

const validateOtpCode = async (email, otp) => {
  try {
    const isValid = await validateOTP(`otp:${email}`, otp);
    if (!isValid) {
      throw new Error("Invalid OTP");
    }
    return { message: "OTP verified successfully" };
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong during OTP verification"
    );
  }
};

const createUserAccount = async (userData) => {
  const transaction = await sequelize.transaction();
  try {
    const existingUser = await User.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await User.create(
      {
        username: userData.email.split("@")[0],
        email: userData.email,
        password: hashedPassword,
      },
      { transaction }
    );

    await transaction.commit();
    return user;
  } catch (error) {
    await transaction.rollback();
    throw new Error(
      error.message || "Something went wrong during user account creation"
    );
  }
};

module.exports = { sendOtpToEmail, validateOtpCode, createUserAccount };
