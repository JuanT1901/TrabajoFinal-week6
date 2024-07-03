const User = require("../../models/User")

const user = async() => {
  const body = {
    firstName: "Alejandro",
    lastName: "Torres",
    email: "alejandro@gmail.com",
    password: "alejandro1234",
    phone: "3042490847",
  }

  await User.create(body)
}

module.exports = user;