import jwt from 'jsonwebtoken';
import User from '../models/User';
import { iToken } from '../interfaces/jwt';
import { Request } from "express";



export const tokenAuthorizationMiddleware = async (ctx) => {
  const req: Request = ctx.req;
  try {
    const token = (req.headers.authorization || '').replace(
      'Bearer ',
      '',
    );

    if (!token)
      return { user: null }
      
    const data = Object.freeze(jwt.verify(token, process.env.SECRET)) as iToken;
    const user = await User.findOne({
      _id: data._id,
      'tokens.token': token,
    }).exec();

    return {
      user,
    };
  } catch (error) {
    console.error(error.message);
    return {
      user: null,
    };
  }
};
