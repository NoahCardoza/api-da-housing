import { createSchema, Type, typedModel } from 'ts-mongoose';
import { UserSchema } from './User';
import { TeamSchema } from './Team';

export const PostSchema = createSchema({
  author: Type.ref(Type.objectId()).to('User', UserSchema),
  team: Type.ref(Type.objectId()).to('Team', TeamSchema),
  title: Type.string({ required: true }),
  content: Type.string({ required: true }),
  date: Type.date({ default: Date.now as any })
});

export default typedModel('Post', PostSchema);
