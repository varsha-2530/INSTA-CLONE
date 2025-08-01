import jwt from "jsonwebtoken";
import { SECRETKEY } from "../keys.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      errorMsg: "Unauthorized. No token found."
    });
  }

  try {
    jwt.verify(token, SECRETKEY, (error, decoded) => {
      if (error || !decoded) {
        return res.status(401).json({
          errorMsg: "Invalid or expired token."
        });
      }
  //console.log("Decoded user ID from token:", decoded.id);
      req.id = decoded.id; 
      next();
      
    });
  } catch (err) {
    console.log("Token verify error:", err);
    res.status(500).json({ errorMsg: "Something went wrong." });
  }
};


export default verifyToken;