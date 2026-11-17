import crypto from 'node:crypto';

export function buildSignedString(
	timestamp: string,
	method: string,
	path: string,
): string {
	const fullPath = path;
	const newPath = fullPath.split('?')[0];
	const signedString = `${timestamp}${method}${newPath}`;
	return signedString;
}

export function signRequest(
	signedString: string,
	privateKeyPem: string,
): string {
	const message = Buffer.from(signedString);
	const key = crypto.createPrivateKey(privateKeyPem);

	if (key.asymmetricKeyType === 'ed25519') {
		return crypto.sign(null, message, key).toString('base64');
	}

	return crypto
		.sign('sha256', message, {
			key,
			padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
			saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
		})
		.toString('base64');
}
