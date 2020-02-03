import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { UserSchema } from './User';
import { FavoriteSchema } from './Favorite';
import { ListingSchema } from './Listing';
import { IssueSchema } from './Issue';
import { PostSchema } from './Post';

export const TeamSchema = createSchema({
  name: Type.string({required: true}),
  members: Type.array({ required: true }).of(Type.ref(Type.objectId()).to('User', UserSchema)),
  budget: Number,
  favorites: Type.array().of(Type.ref(Type.objectId()).to('Favorite', FavoriteSchema)),
  listing: Type.ref(Type.objectId()).to('Listing', ListingSchema),
  issues: Type.array().of(Type.ref(Type.objectId()).to('Issue', IssueSchema)),
  posts: Type.array().of(Type.ref(Type.objectId()).to('Post', PostSchema)),
});

export type TeamDoc = ExtractDoc<typeof TeamSchema>

/**
 * Delete Teams with no members.
 */
TeamSchema.post('find', async function() {
  const teamMembers = this.members;
  if (Array.isArray(teamMembers) && teamMembers.length) {
    this.remove();
  }
});

export default typedModel('Team', TeamSchema);
