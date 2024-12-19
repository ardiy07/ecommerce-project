const { User, Session, sequelize } = require("../models");
const bcrypt = require("bcryptjs");
const {
  getExperiedAt,
  generateToken,
  generateRefreshToken,
} = require("../utils/jwtUtil");

const loginUsecase = async (email, password) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error("Invalid email or password");
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    const experied = getExperiedAt();

    await Session.create(
      {
        refresh_token: refreshToken,
        experied_at: experied,
        user_id: user.id,
      },
      { transaction }
    );

    transaction.commit();

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (error) {
    transaction.rollback();
    throw new Error(error || "Something went wrong");
  }
};

module.exports = loginUsecase;