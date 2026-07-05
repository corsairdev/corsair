import {
	AddresszenAutocompleteResult,
	AddresszenVerifiedAddress,
} from './database';

export const AddresszenSchema = {
	version: '1.0.0',
	entities: {
		autocompleteResults: AddresszenAutocompleteResult,
		verifiedAddresses: AddresszenVerifiedAddress,
	},
} as const;
