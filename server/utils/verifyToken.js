import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const authToken = req.params.token;
  if (authToken) {
    jwt.verify(authToken, process.env.JWT, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      // console.log("user verified!");
      next();
    } else {
      return res.status(403).json("You are not alowed to do that!");
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json("You are not alowed to do that!");
    }
  });
};
