import { KEY_LENGTH } from '../encryption';

export class CorsairKekMissingError extends Error {
	constructor() {
		super(
			'Corsair KEK is missing. Pass `kek` to createCorsair() or set CORSAIR_KEK in your environment. ' +
				`Generate one with: openssl rand -base64 ${KEY_LENGTH}`,
		);
		this.name = 'CorsairKekMissingError';
	}
}
