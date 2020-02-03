import User, { UserDoc } from '../models/User';
import Team, { TeamDoc } from '../models/Team';

export default {
  author: async (parent: any) => User.findById(parent.author).exec() as UserDoc,
  team: async (parent: any) => Team.findById(parent.team).exec() as TeamDoc
};
