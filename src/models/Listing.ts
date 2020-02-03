import { createSchema, Type, typedModel, ExtractDoc } from 'ts-mongoose';
import { UserSchema } from './User';

export const ListingSchema = createSchema({
  name: Type.string({ required: true }),
  price: Type.number({ required: true }),
  images: Type.array({ required: true }).of(Type.string()),
  description: Type.string({ required: true }),
  author: Type.ref(Type.objectId({ required: true })).to('User', UserSchema),
  address: {
    street: Type.string({ required: true }),
    city: Type.string({ required: true }),
    zipcode: Type.number({ required: true }),
    coordinates: {
      latitude: Type.number({ required: true }),
      longitude: Type.number({ required: true })
    },
  }
});

export type ListingDoc = ExtractDoc<typeof ListingSchema>

export default typedModel('listing', ListingSchema);
