import { z } from 'zod';

// Local copies of what agents search for: which domains and mailboxes a team has
// and what state they are in. Rows are written by list operations and webhooks.
// No field here may ever hold a credential: InboxKit sends mailbox passwords in
// webhooks, and endpoints/store.ts picks each field by name to keep them out.

const str = z.string().nullish();
const num = z.number().nullish();
const bool = z.boolean().nullish();

export const InboxkitWorkspace = z.object({
	id: z.string().describe('The workspace uid'),
	name: str,
	workspace_type: str,
	domains: num,
	created_at: str,
});

export const InboxkitDomain = z.object({
	id: z.string().describe('The domain uid'),
	name: str,
	status: str,
	workspace_uid: str,
	connection_type: str,
	dns_propagation_status: str,
	nameserver_match_status: str,
	forwarding_url: str,
	renewal_date: str,
	renewal_status: str,
	assigned_mailboxes: num,
});

export const InboxkitMailbox = z.object({
	id: z.string().describe('The mailbox uid'),
	email: str,
	username: str,
	domain_name: str,
	first_name: str,
	last_name: str,
	platform: str,
	status: str,
	workspace_uid: str,
	is_admin: bool,
	renewal_date: str,
	renewal_status: str,
	sequencer_status: str,
	forwarding_email: str,
});

export type InboxkitWorkspace = z.infer<typeof InboxkitWorkspace>;
export type InboxkitDomain = z.infer<typeof InboxkitDomain>;
export type InboxkitMailbox = z.infer<typeof InboxkitMailbox>;
