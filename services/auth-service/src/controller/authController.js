const { LoginUseCase, RegisterUseCase, LogoutUseCase, RefreshTokenUseCase } = require("../usecase");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await LoginUseCase(email, password);
    res.status(200).json({
      status: "success",
      message: "Login successfully",
      data: {
        accesToken: user.accessToken,
        refreshToken: user.refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

const sendOtpToEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await RegisterUseCase.sendOtpToEmail(email);
    res.status(200).json({
      status: "success",
      message: "OTP sent to email",
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
}

const validateOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await RegisterUseCase.validateOtpCode(email, otp);
    res.status(200).json({
      status: "success",
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

const createUserAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await RegisterUseCase.createUserAccount({ email, password });
    res.status(200).json({
      status: "success",
      message: "Register successfully",
      data: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = await LogoutUseCase(refreshToken);
    res.status(200).json({
      status: "success",
      message: "Logout successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = await RefreshTokenUseCase(refreshToken);
    res.status(200).json({
      status: "success",
      message: "Refresh token successfully",
      data: {
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports = {
  loginUser,
  createUserAccount,
  sendOtpToEmail,
  validateOtp,
  logoutUser,
  refreshToken,
};
