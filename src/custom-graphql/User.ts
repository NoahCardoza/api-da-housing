import Listing from '../models/Listing';

export default {
  favoriteListings: async (parent: any) =>
    Listing.find()
      .where('_id')
      .in(parent.favoriteListings)
      .exec(),
};
