import { Request } from 'express';
import { UserDoc } from '../models/User';
import { TeamDoc } from '../models/Team';
import { ListingDoc } from '../models/Listing';

export interface iUserRequest extends Request {
    user: UserDoc;
    team: TeamDoc;
    listing: ListingDoc;
}