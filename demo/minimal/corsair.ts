import { createCorsair, linear, resend, slack } from 'corsair';
import { database } from './db';

/**
 * This is a minimal example
 * Go to corsair-full.ts for more
 */

export const corsair = createCorsair({
	database,
	multiTenancy: true,
	kek: process.env.CORSAIR_KEK!,
	plugins: [slack(), linear(), resend()],
});

// Get a tenant-scoped instance (because multiTenancy: true in createCorsair)
const tenant = corsair.withTenant('tenant_123');

// Send a Slack message - fully typed!
const slackMessage = await tenant.slack.api.messages.post({
	channel: 'C01234567',
	text: 'Hello from Corsair! 🚀',
});

// TypeScript knows the exact response type
console.log('Message sent:', slackMessage.ts); // ✅ Autocomplete works!
console.log('Channel:', slackMessage.channel); // ✅ Fully typed!

// Create a Linear issue - same syntax, different integration
const linearIssue = await tenant.linear.api.issues.create({
	title: 'New feature request',
	teamId: 'TEAM_ABC',
	description: 'This is a great feature idea!',
});

// Again, fully typed response
console.log('Issue created:', linearIssue.id); // ✅ TypeScript knows this exists!
console.log('Issue title:', linearIssue.title); // ✅ Autocomplete works!

// Query the database - all data is automatically synced
const issues = await tenant.linear.db.issues.list();

// Results are strongly typed
issues.forEach((issue) => {
	console.log(issue.data.title); // ✅ TypeScript knows the structure!
	console.log(issue.data.priority); // ✅ Fully typed!
});
