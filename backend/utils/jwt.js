const jwt = require('jsonwebtoken');

const signToken = (id, type = 'access') => {
  const secret = type === 'access' ? process.env.JWT_SECRET : process.env.JWT_REFRESH_SECRET;
  const expiresIn = type === 'access' ? process.env.JWT_EXPIRES_IN : process.env.JWT_REFRESH_EXPIRES_IN;
  
  return jwt.sign({ id, type }, secret, {
    expiresIn,
  });
};

const createSendToken = async (user, statusCode, req, res) => {
  const accessToken = signToken(user._id, 'access');
  const refreshToken = signToken(user._id, 'refresh');
  
  // Add refresh token to user's refresh tokens array
  user.addRefreshToken(refreshToken);
  await user.save({ validateBeforeSave: false });
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'strict'
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  // Remove password from output
  user.password = undefined;
  user.refreshTokens = undefined;

  res.status(statusCode).json({
    status: 'success',
    token: accessToken,
    data: {
      user,
    },
  });
};

const verifyToken = (token, type = 'access') => {
  const secret = type === 'access' ? process.env.JWT_SECRET : process.env.JWT_REFRESH_SECRET;
  return jwt.verify(token, secret);
};

module.exports = {
  signToken,
  createSendToken,
  verifyToken
};
