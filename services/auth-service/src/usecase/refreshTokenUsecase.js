const { User, Session, sequelize } = require("../models");
const {
  verifyRefreshToken,
  generateToken,
  getExperiedAt,
} = require("../helpers/jwtHelper");

const refreshTokenUsecase = async (refreshToken) => {
  const transaction = await sequelize.transaction();
  try {
    const decode = verifyRefreshToken(refreshToken);
    const session = await Session.findOne({
      where: {
        refresh_token: refreshToken,
      },
      transaction,
      lock: true,
    });

    if (!session) {
      throw new Error("Refresh token is invalid");
    }

    // Experied check
    const now = new Date();
    if (
      session.experied_at < new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    ) {
      throw new Error("Please login again.");
    }

    //   Refresh token
    await Session.update(
      {
        experied_at: getExperiedAt(),
      },
      {
        where: {
          refresh_token: refreshToken,
        },
        transaction,
      }
    );

    const accessToken = generateToken(decode);
    await transaction.commit();

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(
      error.message || "Something went wrong while refreshing the token"
    );
  }
};

module.exports = refreshTokenUsecase;
