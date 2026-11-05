import {
	AddresszenAutocompleteResult,
	AddresszenKeyAvailability,
	AddresszenResolvedAddress,
	AddresszenVerifiedAddress,
} from './database';

export const AddresszenSchema = {
	version: '1.0.0',
	entities: {
		autocompleteResults: AddresszenAutocompleteResult,
		verifiedAddresses: AddresszenVerifiedAddress,
		keyAvailability: AddresszenKeyAvailability,
		resolvedAddresses: AddresszenResolvedAddress,
	},
} as const;
