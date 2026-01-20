import { createCorsair } from 'corsair';
import { drizzleAdapter } from 'corsair/adapters/drizzle';
import { linear, slack } from 'corsair/plugins';
import { db } from './db';
import * as schema from './db/schema';

export const corsair = createCorsair({
	multiTenancy: true,
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	plugins: [
		slack({
			authType: 'bot_token',
			credentials: {
				botToken: process.env.SLACK_BOT_TOKEN ?? 'dev-token',
			},
		}),
		linear({
			authType: 'api_key',
			credentials: {
				apiKey: process.env.LINEAR_API_KEY ?? 'dev-token',
			},
			// onError: {
			// 	429: () => {},
			// 	500: () => {},
			// 	whatever rate limit error is
			// 	whatever auth error is
			// },
		}),
	],
	// onError: {
	// 	429: () => {},
	// 	500: () => {},
	// 	whatever rate limit error is
	// 	whatever auth error is
	// },
});

/**

corsair is built with:
-> sensible default values
-> ergonomic function definitions
-> intuitive documentation
-> build it with 10 lines of code and trust the defaults or customize every detail 

api handling order:

1. before hook

try {
	-> 2. main action
} catch (e) {
	3. on error
		-> split logic by error type
			-> rate limit?
			-> auth error?
			-> default error handling?
}

4. log

5. after hook



main()

onError({
	rateLimit: () => {}

})



 */
