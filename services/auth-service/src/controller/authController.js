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

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await RegisterUseCase({ email, password });
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
  registerUser,
  logoutUser,
  refreshToken,
};
