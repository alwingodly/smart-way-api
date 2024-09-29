import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; 
  console.log(token);
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("token expires");
      return res.sendStatus(403); 
    }
    req.user = user; 
    next();
  });
};
