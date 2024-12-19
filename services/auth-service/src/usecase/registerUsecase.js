const { User, sequelize } = require("../models");
const bcrypt = require("bcryptjs");

const registerUsecase = async (userData) => {
  const transaction = await sequelize.transaction();
  try {
    const validateEmail = await User.findOne({
      where: { email: userData.email },
    });
    if (validateEmail) {
      throw new Error("Email already exists");
    }

    const username = userData.email.split("@")[0];
    const hasPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create(
      {
        username,
        email: userData.email,
        password: hasPassword,
      },
      {
        transaction,
      }
    );

    await transaction.commit();
    return user;
  } catch (error) {
    transaction.rollback();
    throw new Error(error || "Something went wrong");
  }
};

module.exports = registerUsecase;
