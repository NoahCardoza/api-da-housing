import User, { UserDoc } from '../models/User';

export default {
  author: async (parent: any) => User.findById(parent.author).exec() as UserDoc,
};
