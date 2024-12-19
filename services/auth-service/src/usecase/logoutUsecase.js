const { Session, sequelize } = require("../models");

const logoutUsecase = async (refreshToken) => {
  const transaction = await sequelize.transaction();
  try {
    await Session.destroy({
      where: {
        refresh_token: refreshToken,
      },
      transaction,
    });
    transaction.commit();
    return true;
  } catch (error) {
    transaction.rollback();
    throw new Error(error || "Something went wrong");
  }
};

module.exports = logoutUsecase;
