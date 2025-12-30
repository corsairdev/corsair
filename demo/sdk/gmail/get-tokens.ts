import * as dotenv from 'dotenv';
import * as https from 'https';
import * as querystring from 'querystring';
import * as readline from 'readline';

dotenv.config();

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';

if (!CLIENT_ID || !CLIENT_SECRET) {
	console.error(
		'Error: GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET must be set in .env file',
	);
	process.exit(1);
}

const scopes = [
	'https://www.googleapis.com/auth/gmail.modify',
	'https://www.googleapis.com/auth/gmail.labels',
	'https://www.googleapis.com/auth/gmail.send',
	'https://www.googleapis.com/auth/gmail.compose',
];

// Build authorization URL manually
const authParams = querystring.stringify({
	client_id: CLIENT_ID,
	redirect_uri: REDIRECT_URI,
	response_type: 'code',
	scope: scopes.join(' '),
	access_type: 'offline',
	prompt: 'consent',
});

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams}`;

console.log('\n=== Gmail SDK Token Generator ===\n');
console.log('1. Visit this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Authorize the application');
console.log('3. Copy the authorization code\n');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.question('Enter the authorization code here: ', (code: string) => {
	// Exchange authorization code for tokens using Node.js built-in https
	const postData = querystring.stringify({
		code: code.trim(),
		client_id: CLIENT_ID,
		client_secret: CLIENT_SECRET,
		redirect_uri: REDIRECT_URI,
		grant_type: 'authorization_code',
	});

	const options = {
		hostname: 'oauth2.googleapis.com',
		path: '/token',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(postData),
		},
	};

	const req = https.request(options, (res) => {
		let data = '';

		res.on('data', (chunk) => {
			data += chunk;
		});

		res.on('end', () => {
			try {
				if (res.statusCode !== 200) {
					const errorData = JSON.parse(data || '{}');
					throw new Error(
						`Token exchange failed: ${JSON.stringify(errorData)}`,
					);
				}

				const tokens = JSON.parse(data) as {
					access_token?: string;
					refresh_token?: string;
					expires_in?: number;
					token_type?: string;
				};

				if (!tokens.access_token) {
					throw new Error('No access token received from Google');
				}

				console.log('\n=== Success! ===\n');
				console.log('Add these to your .env file:\n');
				console.log(`GMAIL_CLIENT_ID=${CLIENT_ID}`);
				console.log(`GMAIL_CLIENT_SECRET=${CLIENT_SECRET}`);
				if (tokens.refresh_token) {
					console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
				}
				console.log(`GMAIL_ACCESS_TOKEN=${tokens.access_token}`);
				console.log(`GMAIL_USER_ID=me\n`);

				console.log('Note: The access token expires in 1 hour.');
				if (tokens.refresh_token) {
					console.log(
						'The refresh token can be used to get new access tokens.\n',
					);
				} else {
					console.log(
						'Warning: No refresh token received. You may need to re-authorize.\n',
					);
				}
			} catch (error) {
				const err = error as Error;
				console.error('Error getting tokens:', err.message);
				process.exit(1);
			}

			rl.close();
			process.exit(0);
		});
	});

	req.on('error', (error) => {
		console.error('Error making request:', error.message);
		rl.close();
		process.exit(1);
	});

	req.write(postData);
	req.end();
});
