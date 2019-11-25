/**
 * UserToken
 */
export interface IUserToken {
    token?: string;
}

/**
 * User interface definition
 */
export interface IUser {
    email?: string;
    school?: string;
    gender?: string;
    password?: string;
    name?: string;
    favoriteListings?: string[];
    preferences?: string[];
    tokens?: IUserToken[];
}

/**
 * Home Address module scoped
 */
interface IAddress {
    street?: string;
    city?: string;
    zipcode?: number;
    longitude?: number;
    latitude?: number;
}

/**
 * Home listings interface
 */
export interface IListing {
    name?: string;
    price?: number;
    images?: string[];
    description?: string;
    author?: string;
    address?: IAddress;
}

interface IFavorite {
    source?: string;
    name?: string;
    comments?: string[];
}

interface IMember {
    member?: string;
}

/**
 * Team interface
 */
export interface ITeam {
    name?: string;
    members?: IMember[];
    budget?: number;
    favorites: IFavorite[];
    outsideFavorites: IFavorite[];
}

/**
 * Token interface for middlware
 */
export interface ITokenMiddleware {
        _id?: string;
}
