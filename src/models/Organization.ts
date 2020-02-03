import { createSchema, Type, typedModel } from 'ts-mongoose';
import { UserSchema } from './User';

export const OrganizationSchema = createSchema({
  name: Type.string({ required: true, unique: true }),
  location: Type.string({ required: true, unique: true }),
  members: Type.array({ required: true }).of(Type.ref(Type.objectId()).to('User', UserSchema)),
  administrators: Type.array({ required: true }).of(Type.ref(Type.objectId()).to('User', UserSchema)),
});

export default typedModel('Organization', OrganizationSchema);
