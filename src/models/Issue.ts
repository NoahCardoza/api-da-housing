import { createSchema, Type, typedModel } from 'ts-mongoose';
import { UserSchema } from './User';
import { TeamSchema } from './Team';

export const IssueSchema = createSchema({
  author: Type.ref(Type.objectId({ required: true })).to('User', UserSchema),
  team: Type.ref(Type.objectId({ required: true })).to('Team', TeamSchema),
  title: Type.string({ required: true }),
  content: Type.string(),
  date: Type.date({ default: Date.now as any }),
  serviceProvider: {
    name: Type.string(),
    phone: Type.string(),
    email: Type.string(),
  },
});

export default typedModel('Issue', IssueSchema);
