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
    tokens?: string[];
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
    address?: IAddress
}


