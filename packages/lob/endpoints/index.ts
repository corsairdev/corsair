import * as Account from './account';
import * as Addresses from './addresses';
import * as Autocomplete from './autocomplete';
import * as IntlVerifications from './intl-verifications';
import * as Letters from './letters';
import * as Postcards from './postcards';
import * as UsVerifications from './us-verifications';
import * as Zip from './zip';

// The nested shape callers write: `api.<group>.<op>`.
export const lobEndpointsNested = {
	usVerifications: {
		verify: UsVerifications.verify,
		bulk: UsVerifications.bulk,
	},
	intlVerifications: {
		verify: IntlVerifications.verify,
	},
	autocomplete: {
		usAutocomplete: Autocomplete.usAutocomplete,
	},
	zip: {
		usZipLookup: Zip.usZipLookup,
	},
	addresses: {
		create: Addresses.create,
		get: Addresses.get,
		list: Addresses.list,
		// `delete` is reserved, so the function is `remove`.
		delete: Addresses.remove,
	},
	postcards: {
		send: Postcards.send,
		get: Postcards.get,
	},
	letters: {
		send: Letters.send,
		get: Letters.get,
	},
	account: {
		getBalance: Account.getBalance,
	},
} as const;

export * from './types';
