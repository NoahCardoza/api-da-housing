import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { UserSchema } from './User'
import { TeamSchema } from './Team'

export const FavoriteSchema = createSchema({
  source: Type.string({ required: true }),
  name: Type.string({ required: true }),
  author: Type.ref(Type.objectId({ required: true })).to('User', UserSchema),
  team: Type.ref(Type.objectId({ required: true })).to('Team', TeamSchema),
  comments: Type.array().of(Type.string())
});

export type FavoriteDoc = ExtractDoc<typeof FavoriteSchema>

export default typedModel('Favorite', FavoriteSchema);
