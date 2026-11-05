// Kept apart from index.ts so error-handlers.ts can read risk levels without
// importing the plugin entry. index.ts checks it against the endpoint tree.
// read: only reads. write: creates, sends or changes something, including on
// LinkedIn. destructive: removes or withdraws something.
export const unipileEndpointMeta = {
	'accounts.list': {
		riskLevel: 'read',
		description:
			'List connected Unipile accounts (LinkedIn and others) with their acc_ IDs, provider and status; filter by provider or status',
	},
	'accounts.get': {
		riskLevel: 'read',
		description:
			'Get one connected account: provider, status (running, disconnected, errored…), lock state and connection method',
	},
	'accounts.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Disconnect an account from Unipile and delete all its Unipile data. The user must link it again to use it',
	},
	'accounts.createAuthLink': {
		riskLevel: 'write',
		description:
			'Create a Hosted Auth link for a user to connect a LinkedIn (or other) account, or to reconnect one with account_id; LinkedIn sign-in can offer credentials, cookies or the UniLogin extension',
	},
	'users.getProfile': {
		riskLevel: 'read',
		description:
			"Get a LinkedIn profile by member ID or public identifier: headline, location, network distance, invitation status, and optional experience, education and skills. Each call counts toward LinkedIn's profile-view limit (about 80-100 a day), so it is not retried after a timeout or 5xx, only after Unipile's own rate limit",
	},
	'users.visitProfile': {
		riskLevel: 'write',
		description:
			"Report a profile visit to LinkedIn so the member sees you in 'Who viewed your profile', using the notify_visit_token from users.getProfile. Counts toward LinkedIn's profile-view limit and is not retried after a timeout or 5xx",
	},
	'users.listRelations': {
		riskLevel: 'read',
		description:
			"List a user's 1st-degree connections (the account owner's by default), with optional name search and paging",
	},
	'users.getChat': {
		riskLevel: 'read',
		description:
			'Find the existing chats with a user by their provider ID, on any provider, to send into instead of starting a new one. Can return several chats across inboxes',
	},
	'users.listReactions': {
		riskLevel: 'read',
		description:
			"List the posts a user reacted to (the account owner's by default), with each post",
	},
	'users.listComments': {
		riskLevel: 'read',
		description:
			"List a user's comments on posts (the account owner's by default), with each post",
	},
	'relationRequests.list': {
		riskLevel: 'read',
		description:
			'List pending LinkedIn invitations the account sent or received, with the other person and any note',
	},
	'relationRequests.create': {
		riskLevel: 'write',
		description:
			'Send a LinkedIn connection invitation to a member ID (ACo…), with an optional note. LinkedIn allows roughly 100-200 a week; pace sends and never retry a failed one blindly',
	},
	'relationRequests.cancel': {
		riskLevel: 'destructive',
		description:
			'Withdraw a sent LinkedIn invitation or decline a received one. LinkedIn may block re-inviting the same person for weeks',
	},
	'relationRequests.accept': {
		riskLevel: 'write',
		description: 'Accept a LinkedIn invitation the account received',
	},
	'chats.list': {
		riskLevel: 'read',
		description:
			"List the account's chats, newest first, filtered by type, date, unread or archived. WhatsApp, Telegram and Instagram; on LinkedIn use inboxes.listChats. WhatsApp and Telegram channels, communities and broadcasts are not returned",
	},
	'chats.get': {
		riskLevel: 'read',
		description:
			'Get one chat on any provider: participants, unread count, last message and whether sending is restricted',
	},
	'chats.start': {
		riskLevel: 'write',
		description:
			'Start a chat on WhatsApp, Telegram or Instagram by sending the first message (an array of users_ids makes a group; an existing 1-to-1 chat just gets the message). On LinkedIn use inboxes.startChat. Never retried after a timeout or 5xx',
	},
	'messages.list': {
		riskLevel: 'read',
		description:
			'List the messages in a chat on any provider, newest first, with sender, read and delivery state',
	},
	'messages.send': {
		riskLevel: 'write',
		description:
			'Send a message in an existing chat on any provider, optionally with attachments or as a reply (quote_id). WhatsApp sends one attachment per message; LinkedIn caps attachments at 20 MB. Never retried after a timeout or 5xx',
	},
	'posts.list': {
		riskLevel: 'read',
		description:
			"List a user's posts (LinkedIn or Instagram) with reaction, comment and repost counts. LinkedIn post reads count toward a daily limit (about 80-100), so this is not retried after a timeout or 5xx",
	},
	'posts.listReactions': {
		riskLevel: 'read',
		description:
			'List the people who reacted to a post, with their profile summary, to find engaged leads',
	},
	'posts.listComments': {
		riskLevel: 'read',
		description:
			'List the comments on a post with each author, newest or most relevant first',
	},
	'webhookEndpoints.list': {
		riskLevel: 'read',
		description:
			'List the Unipile webhook endpoints, their URLs, events and accounts (signing secrets are never returned). Needs a Service API Key',
	},
	'webhookEndpoints.get': {
		riskLevel: 'read',
		description:
			'Get one Unipile webhook endpoint: URL, events, accounts and whether it has a signing secret (the secret is never returned). Needs a Service API Key',
	},
	'webhookEndpoints.create': {
		riskLevel: 'write',
		description:
			'Register a URL to receive Unipile events such as relation.new and message.new. Returns the signing secret once, and only here: store it as the plugin webhookSecret right away. Needs a Service API Key',
	},
	'webhookEndpoints.update': {
		riskLevel: 'write',
		description:
			"Change a webhook endpoint's URL, events, accounts or description, or enable or disable it. Keeps the signing secret, which is not returned. Needs a Service API Key",
	},
	'webhookEndpoints.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a Unipile webhook endpoint; its events stop. Needs a Service API Key',
	},
	'inboxes.list': {
		riskLevel: 'read',
		description:
			"List a LinkedIn account's inboxes (Classic, Sales Navigator, Recruiter, company pages). Only a product's primary inbox (e.g. CLASSIC_PRIMARY) can start chats",
	},
	'inboxes.listChats': {
		riskLevel: 'read',
		description:
			'List the chats in one LinkedIn inbox, newest first. This is how LinkedIn chats are listed (chats.list covers the other providers); Classic and Sales Navigator page by offset, Recruiter by cursor',
	},
	'inboxes.startChat': {
		riskLevel: 'write',
		description:
			'Start a LinkedIn chat from a primary inbox (e.g. CLASSIC_PRIMARY) by sending the first message; an existing 1-to-1 chat just gets it. InMail spends credits; Sales Navigator needs a subject. Never retried after a timeout or 5xx',
	},
	'chats.update': {
		riskLevel: 'write',
		description:
			'Change a chat: mark it read or unread, archive, mute, rename (groups) or label (WhatsApp Business). Marking read does not mark its messages; Telegram cannot archive',
	},
	'chats.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a whole chat. LinkedIn Classic and WhatsApp only; other providers answer 501',
	},
	'chats.getPicture': {
		riskLevel: 'read',
		description:
			"Download a chat's picture (Telegram only). Returns the type and size only, unless include_content is set (then base64, up to max_bytes)",
	},
	'chats.listParticipants': {
		riskLevel: 'read',
		description:
			'List the participants of a group chat (fails on 1-to-1 chats). LinkedIn Classic, WhatsApp, Telegram and Instagram',
	},
	'chats.addParticipant': {
		riskLevel: 'write',
		description:
			'Add someone to a group chat; they are notified. On WhatsApp, Telegram and Instagram the account needs permission to add members, or the call can succeed without adding anyone',
	},
	'chats.removeParticipant': {
		riskLevel: 'destructive',
		description:
			"Remove someone from a group chat, or pass the account's own user ID to leave it (the chat becomes read-only). Non-admins on WhatsApp, Telegram and Instagram can get success without a removal",
	},
	'chats.setComposing': {
		riskLevel: 'write',
		description:
			"Show the 'typing…' or 'recording' indicator in a chat. LinkedIn Classic, WhatsApp and Telegram (Telegram clears it after about 5 seconds)",
	},
	'messages.get': {
		riskLevel: 'read',
		description:
			'Get one message: text, sender, attachments, reactions, and read and delivery state. Not on LinkedIn Sales Navigator or Recruiter',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete a message the account sent. WhatsApp and Telegram delete it for everyone; some providers leave a 'deleted' placeholder, and WhatsApp can report success outside its time limit without deleting",
	},
	'messages.forward': {
		riskLevel: 'write',
		description:
			'Forward a message to another chat (to_chat_id). WhatsApp and Telegram ignore the extra text; not on LinkedIn Sales Navigator or Recruiter. Sends immediately and is never retried after a timeout or 5xx',
	},
	'messages.edit': {
		riskLevel: 'write',
		description:
			'Edit the text of a message the account sent. Instagram allows it for 15 minutes; WhatsApp can report success outside its limits without editing',
	},
	'messages.markRead': {
		riskLevel: 'write',
		description:
			"Mark someone else's message as read (the sender may see a read receipt). Does not change the chat's read state; not on LinkedIn Sales Navigator or Recruiter",
	},
	'messages.pin': {
		riskLevel: 'write',
		description:
			'Pin or unpin a message (pin_status false unpins). WhatsApp, Telegram and Instagram; WhatsApp pins expire after 24 hours, 7 or 30 days',
	},
	'messages.listReactions': {
		riskLevel: 'read',
		description:
			'List who reacted to a message with what. LinkedIn Classic, WhatsApp, Telegram and Instagram (counts are already on the message)',
	},
	'messages.addReaction': {
		riskLevel: 'write',
		description:
			'React to a message with an emoji; the other participants see it. WhatsApp, Telegram and Instagram keep one reaction per person (a new one replaces it); some providers allow only a fixed set',
	},
	'messages.removeReaction': {
		riskLevel: 'destructive',
		description:
			"Remove the account's own reaction from a message (pass the same emoji)",
	},
	'messages.getAttachment': {
		riskLevel: 'read',
		description:
			'Download a message attachment. Returns the type and size only, unless include_content is set (then base64, up to max_bytes). Attachments marked is_unavailable cannot be downloaded',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			"List the account's contacts on WhatsApp, Gmail or Outlook (not Telegram or IMAP), with paging. A contact does not mean a chat exists",
	},
	'users.setPresence': {
		riskLevel: 'write',
		description:
			"Set the account's own presence: online, offline, away or restricted_online. LinkedIn Classic, WhatsApp, Telegram and Instagram",
	},
	'users.getPresence': {
		riskLevel: 'read',
		description:
			'Get whether a user is online and when they were last seen (Instagram, LinkedIn, Telegram, WhatsApp). unknown means not shared, not offline',
	},
	'users.getPicture': {
		riskLevel: 'read',
		description:
			"Download a user's profile picture (Telegram only; me for the owner). Returns the type and size only, unless include_content is set",
	},
	'users.updateProfile': {
		riskLevel: 'write',
		description:
			"Update the account owner's own LinkedIn or Instagram profile (user_id me): headline, about, location, skills and similar. Changes are public, and notify_network announces them",
	},
	'users.removeRelation': {
		riskLevel: 'destructive',
		description:
			'Remove a LinkedIn connection (1st-degree relation). Use users.unfollow for one-way follows; reconnecting needs a new invitation',
	},
	'users.listFollowers': {
		riskLevel: 'read',
		description:
			"List a user's followers on LinkedIn or Instagram (me for the owner); LinkedIn pages by offset",
	},
	'users.listFollowing': {
		riskLevel: 'read',
		description:
			'List the accounts a user follows on LinkedIn or Instagram. LinkedIn accepts only user_id me; pages by offset',
	},
	'users.follow': {
		riskLevel: 'write',
		description:
			'Follow a user on LinkedIn or Instagram (a private profile gets a follow request). Does not create a LinkedIn connection; fails if already followed',
	},
	'users.unfollow': {
		riskLevel: 'destructive',
		description:
			'Stop following a user on LinkedIn or Instagram; fails if not followed',
	},
	'emails.list': {
		riskLevel: 'read',
		description:
			'List emails across folders, newest first, with filters (folder, from, to, date, text) and cursor paging; meta_only skips bodies. Gmail and Outlook; IMAP only with Initial Sync, otherwise use emails.listInFolder',
	},
	'emails.listInFolder': {
		riskLevel: 'read',
		description:
			'List the emails in one folder or Gmail label (folder_id from folders.list), newest first. Works on IMAP without Initial Sync',
	},
	'emails.getThread': {
		riskLevel: 'read',
		description:
			"Get a whole email conversation by the email's thread_id (not its id). IMAP threads are inferred from headers and can be incomplete",
	},
	'emails.get': {
		riskLevel: 'read',
		description:
			'Get one email: headers, sender and recipients, body, folders or labels, and attachment metadata (download with emails.getAttachment)',
	},
	'emails.trash': {
		riskLevel: 'destructive',
		description:
			"Move an email to the provider's trash. Permanent deletion is not available",
	},
	'emails.getAttachment': {
		riskLevel: 'read',
		description:
			'Download an email attachment. Returns the type and size only, unless include_content is set (then base64, up to max_bytes)',
	},
	'emails.modify': {
		riskLevel: 'write',
		description:
			'Move an email or set its labels: folders_ids replaces them all (on Gmail list every label to keep; Outlook allows one folder). Archive, junk or flag by moving to the folder with that role',
	},
	'emails.markRead': {
		riskLevel: 'write',
		description:
			"Mark an email as read for the account (does not trigger the sender's tracking pixel)",
	},
	'emails.markUnread': {
		riskLevel: 'write',
		description: 'Mark an email as unread',
	},
	'emails.send': {
		riskLevel: 'write',
		description:
			'Send an email (from must be one of emails.listSenders; reply in-thread with reply_to_message_id), with base64 attachments and optional open/click tracking. Gmail advises 50-100 a day. Never retried after a timeout or 5xx',
	},
	'emails.listSenders': {
		riskLevel: 'read',
		description:
			'List the addresses the account can send from: the main address plus aliases (Gmail; Outlook on Microsoft 365 or Exchange)',
	},
	'drafts.list': {
		riskLevel: 'read',
		description:
			'List email drafts, newest first (Gmail and Outlook; IMAP answers 501)',
	},
	'drafts.create': {
		riskLevel: 'write',
		description:
			'Save an email draft without sending it; reply drafts use reply_to_message_id. Outlook attachments must be under 3 MB each',
	},
	'drafts.get': {
		riskLevel: 'read',
		description:
			'Get one email draft with its recipients, subject, body and attachment metadata',
	},
	'drafts.update': {
		riskLevel: 'write',
		description:
			'Change an email draft; fields left out stay, but attachments replaces the whole list. Outlook attachments must be under 3 MB each',
	},
	'drafts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an email draft permanently',
	},
	'drafts.send': {
		riskLevel: 'write',
		description:
			'Send an existing draft; the draft is deleted afterwards. Never retried after a timeout or 5xx',
	},
	'folders.list': {
		riskLevel: 'read',
		description:
			'List email folders (Outlook, IMAP) or labels (Gmail) with their role (INBOX, SENT, TRASH, ARCHIVE, JUNK…) and counts, with paging',
	},
	'folders.create': {
		riskLevel: 'write',
		description:
			'Create an email folder or Gmail label. parent_id (sub-folders) is Outlook only; colors are Gmail only',
	},
	'folders.get': {
		riskLevel: 'read',
		description:
			'Get one email folder or label by its provider ID from folders.list',
	},
	'folders.update': {
		riskLevel: 'write',
		description:
			'Rename or change an email folder or label; colors are Gmail only, parent_id Outlook only',
	},
	'folders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an email folder or label. Gmail keeps the emails (only the label goes); Outlook and IMAP permanently delete every email in the folder',
	},
	'calendars.list': {
		riskLevel: 'read',
		description:
			"List the account's calendars, owned and shared (Google Calendar or Outlook)",
	},
	'calendars.create': {
		riskLevel: 'write',
		description: 'Create a calendar on the account',
	},
	'calendars.get': {
		riskLevel: 'read',
		description:
			'Get one calendar: name, timezone, colour, and whether it is the default or read-only',
	},
	'calendars.update': {
		riskLevel: 'write',
		description: 'Rename or change a calendar',
	},
	'calendars.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a calendar and permanently delete all its events. The default calendar cannot be deleted',
	},
	'calendarEvents.list': {
		riskLevel: 'read',
		description:
			"List the events in a calendar between two dates, with paging; cancelled events are included unless is_cancelled is false. Outlook does not refresh other attendees' responses on invitations",
	},
	'calendarEvents.create': {
		riskLevel: 'write',
		description:
			'Create an event (timed: date_time plus IANA timezone; all-day: date). Attendees are invited by the provider; leave conference.url out to ask for a native Meet or Teams link',
	},
	'calendarEvents.get': {
		riskLevel: 'read',
		description:
			"Get one event with its attendees and their responses (Outlook invitations show only the account's own response)",
	},
	'calendarEvents.update': {
		riskLevel: 'write',
		description:
			'Change an event; send only the fields that change. A series ID edits the whole series, an occurrence ID just that one. Attendees may be notified',
	},
	'calendarEvents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete an event from the account's calendar permanently. To call off a meeting you organize and notify attendees, use calendarEvents.cancel",
	},
	'calendarEvents.respond': {
		riskLevel: 'write',
		description:
			'Answer an invitation: yes, maybe or no, with an optional comment. The organizer sees it; on Outlook, declining removes the event',
	},
	'calendarEvents.cancel': {
		riskLevel: 'destructive',
		description:
			'Cancel an event the account organizes and notify the attendees. Google keeps it as cancelled; Outlook moves it to Deleted Items',
	},
	'calendarEvents.restore': {
		riskLevel: 'write',
		description:
			'Restore an event the account cancelled. Google Calendar only, organizer only, while Google still has it',
	},
	'posts.get': {
		riskLevel: 'read',
		description:
			'Get one post by its Unipile ID or a native LinkedIn ID (activity:…, ugcPost:…). LinkedIn post reads count toward a daily limit (about 80-100), so this is not retried after a timeout or 5xx',
	},
	'posts.create': {
		riskLevel: 'write',
		description:
			'Publish a post on LinkedIn or Instagram. It goes live publicly right away (Instagram needs media). LinkedIn supports mentions, audience and posting as a managed company page. Never retried after a timeout or 5xx',
	},
	'posts.update': {
		riskLevel: 'write',
		description:
			'Edit a post the account published (Unipile post ID). The change is public',
	},
	'posts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a post the account published (Unipile post ID)',
	},
	'posts.createStory': {
		riskLevel: 'write',
		description:
			'Publish an Instagram story with exactly one image or video. It goes live publicly right away',
	},
	'posts.addReaction': {
		riskLevel: 'write',
		description:
			'React to a post (LinkedIn: like, celebrate, support, love, insightful, funny; Instagram: like). The reaction is public; LinkedIn advises 80-100 reactions and comments a day',
	},
	'posts.removeReaction': {
		riskLevel: 'destructive',
		description:
			"Remove the account's reaction from a post (pass the same reaction)",
	},
	'posts.addComment': {
		riskLevel: 'write',
		description:
			'Comment on a post, optionally as a managed LinkedIn company page. The comment is public; LinkedIn advises 80-100 a day. Never retried after a timeout or 5xx',
	},
	'posts.updateComment': {
		riskLevel: 'write',
		description:
			'Edit a comment the account wrote (LinkedIn only). The change is public',
	},
	'posts.deleteComment': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a comment the account wrote',
	},
	'posts.replyToComment': {
		riskLevel: 'write',
		description:
			'Reply to a comment, optionally as a managed LinkedIn company page. The reply is public. Never retried after a timeout or 5xx',
	},
	'posts.listCommentReplies': {
		riskLevel: 'read',
		description:
			'List the replies to a comment, newest first (LinkedIn pages by offset)',
	},
	'posts.listCommentReactions': {
		riskLevel: 'read',
		description:
			'List who reacted to a comment with what (LinkedIn pages by offset)',
	},
	'posts.addCommentReaction': {
		riskLevel: 'write',
		description:
			'React to a comment, optionally as a managed company page. The reaction is public',
	},
	'posts.removeCommentReaction': {
		riskLevel: 'destructive',
		description:
			"Remove the account's reaction from a comment (pass the same reaction)",
	},
	'linkedin.getInmailCredits': {
		riskLevel: 'read',
		description:
			'Get how many InMail credits the LinkedIn account has left (classic, sales_navigator or recruiter; all when omitted). Check before an InMail with inboxes.startChat',
	},
	'linkedin.listContracts': {
		riskLevel: 'read',
		description:
			'List the Sales Navigator or Recruiter contracts (seats) the account can use (403 unless that product was activated when the account was linked)',
	},
	'linkedin.selectContract': {
		riskLevel: 'write',
		description:
			'Switch to another Sales Navigator or Recruiter contract; later calls and webhooks for that product use it',
	},
	'linkedin.listProfileViews': {
		riskLevel: 'read',
		description:
			"List who viewed the account's LinkedIn profile, with offset paging and filters (date range, industry, company, location). Without Premium the data is limited and filters are ignored",
	},
	'linkedin.getCompany': {
		riskLevel: 'read',
		description:
			'Get a LinkedIn company page by numeric ID or URL slug: description, industry, size, locations, website. LinkedIn advises at most 80 a day (150 with Premium), so this is not retried after a timeout or 5xx',
	},
	'linkedin.listManagedCompanyPages': {
		riskLevel: 'read',
		description:
			'List the LinkedIn company pages the account administers; their IDs work as post_as, comment_as, react_as and for follow invitations',
	},
	'linkedin.inviteToFollowCompany': {
		riskLevel: 'write',
		description:
			"Invite 1st-degree connections (ACo… IDs) to follow a company page the account administers. Spends the page's monthly credits; success can be partial (invitations_count), so never resend the whole batch",
	},
	'linkedin.getCompanyFollowCredits': {
		riskLevel: 'read',
		description:
			"Get a company page's remaining follow-invitation credits and when they reset",
	},
	'linkedin.endorseSkill': {
		riskLevel: 'write',
		description:
			'Endorse a skill of a 1st-degree connection (skill_id from users.getProfile with linkedin_skills). The member is notified and it shows on their profile',
	},
	'linkedin.request': {
		riskLevel: 'write',
		description:
			"Advanced: send a raw request to any LinkedIn endpoint through the account's session and get LinkedIn's response as is. Can read or change anything the account can; prefer the typed operations. Never retried after a timeout or 5xx",
	},
	'linkedin.getSearchParameters': {
		riskLevel: 'read',
		description:
			'Look up the IDs LinkedIn searches need (type LOCATION, COMPANY, INDUSTRY, SCHOOL, JOB_TITLE, SKILL… plus keywords; up to 100). Searches, profile views and profile updates take these IDs, not text',
	},
	'linkedin.searchFromUrl': {
		riskLevel: 'read',
		description:
			"Run a LinkedIn search from a linkedin.com/search/results/people, /companies or /content URL; page with next_cursor and the same URL. Counts toward LinkedIn's daily search limit (about 1,000 profiles)",
	},
	'linkedin.searchPeople': {
		riskLevel: 'read',
		description:
			'Search LinkedIn people by keywords, location, company, school, industry and network distance (IDs from linkedin.getSearchParameters); 10 per page, cursor paging. LinkedIn advises at most 1,000 profiles a day',
	},
	'linkedin.searchCompanies': {
		riskLevel: 'read',
		description:
			"Search LinkedIn companies by keywords, location, industry and headcount (IDs from linkedin.getSearchParameters); cursor paging. Counts toward LinkedIn's daily search limit",
	},
	'linkedin.searchPosts': {
		riskLevel: 'read',
		description:
			'Search LinkedIn posts by keywords, author or mention (IDs from linkedin.getSearchParameters), to find people engaging with a topic; cursor paging, up to 49 per page. Counts toward the daily search limit',
	},
	'linkedin.searchJobs': {
		riskLevel: 'read',
		description:
			'Search LinkedIn job postings by keywords, company, location, function and title (IDs from linkedin.getSearchParameters); offset paging, up to 100 per page',
	},
	'salesNavigator.getSearchParameters': {
		riskLevel: 'read',
		description:
			'Look up the IDs Sales Navigator filters need (type COMPANY, LOCATION, INDUSTRY, JOB_TITLE, PERSONA, LEAD_LIST, saved and recent searches…; up to 100). Needs Sales Navigator',
	},
	'salesNavigator.searchFromUrl': {
		riskLevel: 'read',
		description:
			'Run a Sales Navigator search from a linkedin.com/sales/search/people or /company URL; offset paging, up to 50 per page. Needs Sales Navigator; LinkedIn advises at most 2,500 profiles a day',
	},
	'salesNavigator.searchPeople': {
		riskLevel: 'read',
		description:
			'Search leads in Sales Navigator with include/exclude filters (IDs from salesNavigator.getSearchParameters) or a saved search; offset paging, up to 100 per page. LinkedIn advises at most 2,500 profiles a day',
	},
	'salesNavigator.searchCompanies': {
		riskLevel: 'read',
		description:
			'Search accounts (companies) in Sales Navigator with include/exclude filters, spotlights and headcount ranges; offset paging, up to 100 per page',
	},
	'salesNavigator.listLeadLists': {
		riskLevel: 'read',
		description:
			"List the account's Sales Navigator lead lists (with several contracts, run linkedin.selectContract first); offset paging",
	},
	'salesNavigator.browseLeadList': {
		riskLevel: 'read',
		description:
			'List the leads in a Sales Navigator lead list, with filters; offset paging',
	},
	'salesNavigator.saveLead': {
		riskLevel: 'write',
		description:
			'Add a lead (user_id from a people search) to an existing Sales Navigator lead list. Lists cannot be created here',
	},
	'salesNavigator.listAccountLists': {
		riskLevel: 'read',
		description:
			"List the account's Sales Navigator account (company) lists; offset paging",
	},
	'salesNavigator.browseAccountList': {
		riskLevel: 'read',
		description:
			'List the companies in a Sales Navigator account list, with filters; offset paging',
	},
	'salesNavigator.saveAccount': {
		riskLevel: 'write',
		description:
			'Add a company (company_id from a companies search) to an existing Sales Navigator account list. Lists cannot be created here',
	},
	'accounts.update': {
		riskLevel: 'write',
		description:
			'Update a connected account: its name, custom data, proxy settings or LinkedIn products',
	},
	'auth.startIntent': {
		riskLevel: 'write',
		description:
			"Advanced: connect an account without Hosted Auth by sending the user's provider credentials (or UniLogin) yourself. Returns a checkpoint to solve or the new account. Prefer accounts.createAuthLink",
	},
	'auth.solveCheckpoint': {
		riskLevel: 'write',
		description:
			'Answer the checkpoint (2FA code, OTP, captcha, in-app approval) that auth.startIntent returned',
	},
	'auth.requestCheckpoint': {
		riskLevel: 'write',
		description:
			'Ask the provider for a different checkpoint method (for example SMS instead of email) during auth.startIntent',
	},
	'auth.resendCheckpoint': {
		riskLevel: 'write',
		description:
			'Ask the provider to send the checkpoint code or notification again during auth.startIntent',
	},
	'scopes.list': {
		riskLevel: 'read',
		description:
			'List the Scopes (customer or workspace boundaries) in the application. Needs a Service API Key',
	},
	'scopes.create': {
		riskLevel: 'write',
		description:
			"Create a Scope to group one customer's accounts. Needs a Service API Key",
	},
	'scopes.get': {
		riskLevel: 'read',
		description: 'Get one Scope. Needs a Service API Key',
	},
	'scopes.update': {
		riskLevel: 'write',
		description: 'Rename, enable or disable a Scope. Needs a Service API Key',
	},
	'scopes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Scope. Needs a Service API Key',
	},
	'apiKeys.list': {
		riskLevel: 'read',
		description:
			"List the application's API keys (names, prefixes, roles and expiry; never the keys themselves). Needs a Service API Key",
	},
	'apiKeys.create': {
		riskLevel: 'write',
		description:
			'Create a global or scoped Account API Key. Returns the key once, and only here: store it right away. Needs a Service API Key',
	},
	'apiKeys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an API key; requests using it fail from then on. Needs a Service API Key',
	},
	'webhookEvents.listDeliveries': {
		riskLevel: 'read',
		description:
			'List webhook delivery attempts (event, endpoint, status, response) from the last seven days, to debug missing events. Needs a Service API Key',
	},
	'webhookEvents.replay': {
		riskLevel: 'write',
		description:
			'Queue another delivery of a stored event (evt_…) to every enabled endpoint that matches it, even if it was delivered before. Receivers must handle the duplicate. Needs a Service API Key',
	},
} as const;
