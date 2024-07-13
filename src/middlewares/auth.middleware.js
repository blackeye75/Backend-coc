import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt, { decode } from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(async (req, res, next) => {
 try {
   const token =
     req.cookies?.accessToken ||
     req.header("Authorization")?.replace("Bearer ", "");
 
   if (!token) {
     throw new ApiError(401, "Unauthorize request");
   }
   const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
   const user = await User.findById(decodeToken?._id).select(
     "-passsword -refreshToken"
   );
   if (!user) {
     throw new ApiError(401, "Inavalid Access Token");
   }
   req.user = user;
   next();
 } catch (error) {
  throw new ApiError(401,error.message||"Invalid Access Token")
 }
});
