const catchAsync = require("./catchAsync");

const isTestAccount = catchAsync(async (req, res, next) => {
  if(req.user.username === "test") throw new Error("Test Account can't do this task. Please create your own account.");
  next();
});

module.exports = isTestAccount;