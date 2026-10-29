# @corsair-dev/unipile

Unipile plugin for Corsair: LinkedIn profiles, invitations, relations, chats, messages and webhooks.

## Install

```bash
pnpm add @corsair-dev/unipile
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.createAuthLink` | `unipile.api.accounts.createAuthLink` | `write` | Create a Hosted Auth link for a user to connect a LinkedIn (or other) account, or to reconnect one with account_id; LinkedIn sign-in can offer credentials, cookies or the UniLogin extension |
| `accounts.get` | `unipile.api.accounts.get` | `read` | Get one connected account: provider, status (running, disconnected, errored…), lock state and connection method |
| `accounts.list` | `unipile.api.accounts.list` | `read` | List connected Unipile accounts (LinkedIn and others) with their acc_ IDs, provider and status; filter by provider or status |
| `accounts.remove` | `unipile.api.accounts.remove` | `destructive` | Disconnect an account from Unipile and delete all its Unipile data. The user must link it again to use it |
| `accounts.update` | `unipile.api.accounts.update` | `write` | Update a connected account: its name, custom data, proxy settings or LinkedIn products |
| `apiKeys.create` | `unipile.api.apiKeys.create` | `write` | Create a global or scoped Account API Key. Returns the key once, and only here: store it right away. Needs a Service API Key |
| `apiKeys.delete` | `unipile.api.apiKeys.delete` | `destructive` | Delete an API key; requests using it fail from then on. Needs a Service API Key |
| `apiKeys.list` | `unipile.api.apiKeys.list` | `read` | List the application's API keys (names, prefixes, roles and expiry; never the keys themselves). Needs a Service API Key |
| `auth.requestCheckpoint` | `unipile.api.auth.requestCheckpoint` | `write` | Ask the provider for a different checkpoint method (for example SMS instead of email) during auth.startIntent |
| `auth.resendCheckpoint` | `unipile.api.auth.resendCheckpoint` | `write` | Ask the provider to send the checkpoint code or notification again during auth.startIntent |
| `auth.solveCheckpoint` | `unipile.api.auth.solveCheckpoint` | `write` | Answer the checkpoint (2FA code, OTP, captcha, in-app approval) that auth.startIntent returned |
| `auth.startIntent` | `unipile.api.auth.startIntent` | `write` | Advanced: connect an account without Hosted Auth by sending the user's provider credentials (or UniLogin) yourself. Returns a checkpoint to solve or the new account. Prefer accounts.createAuthLink |
| `calendarEvents.cancel` | `unipile.api.calendarEvents.cancel` | `destructive` | Cancel an event the account organizes and notify the attendees. Google keeps it as cancelled; Outlook moves it to Deleted Items |
| `calendarEvents.create` | `unipile.api.calendarEvents.create` | `write` | Create an event (timed: date_time plus IANA timezone; all-day: date). Attendees are invited by the provider; leave conference.url out to ask for a native Meet or Teams link |
| `calendarEvents.delete` | `unipile.api.calendarEvents.delete` | `destructive` | Delete an event from the account's calendar permanently. To call off a meeting you organize and notify attendees, use calendarEvents.cancel |
| `calendarEvents.get` | `unipile.api.calendarEvents.get` | `read` | Get one event with its attendees and their responses (Outlook invitations show only the account's own response) |
| `calendarEvents.list` | `unipile.api.calendarEvents.list` | `read` | List the events in a calendar between two dates, with paging; cancelled events are included unless is_cancelled is false. Outlook does not refresh other attendees' responses on invitations |
| `calendarEvents.respond` | `unipile.api.calendarEvents.respond` | `write` | Answer an invitation: yes, maybe or no, with an optional comment. The organizer sees it; on Outlook, declining removes the event |
| `calendarEvents.restore` | `unipile.api.calendarEvents.restore` | `write` | Restore an event the account cancelled. Google Calendar only, organizer only, while Google still has it |
| `calendarEvents.update` | `unipile.api.calendarEvents.update` | `write` | Change an event; send only the fields that change. A series ID edits the whole series, an occurrence ID just that one. Attendees may be notified |
| `calendars.create` | `unipile.api.calendars.create` | `write` | Create a calendar on the account |
| `calendars.delete` | `unipile.api.calendars.delete` | `destructive` | Delete a calendar and permanently delete all its events. The default calendar cannot be deleted |
| `calendars.get` | `unipile.api.calendars.get` | `read` | Get one calendar: name, timezone, colour, and whether it is the default or read-only |
| `calendars.list` | `unipile.api.calendars.list` | `read` | List the account's calendars, owned and shared (Google Calendar or Outlook) |
| `calendars.update` | `unipile.api.calendars.update` | `write` | Rename or change a calendar |
| `chats.addParticipant` | `unipile.api.chats.addParticipant` | `write` | Add someone to a group chat; they are notified. On WhatsApp, Telegram and Instagram the account needs permission to add members, or the call can succeed without adding anyone |
| `chats.delete` | `unipile.api.chats.delete` | `destructive` | Delete a whole chat. LinkedIn Classic and WhatsApp only; other providers answer 501 |
| `chats.get` | `unipile.api.chats.get` | `read` | Get one chat on any provider: participants, unread count, last message and whether sending is restricted |
| `chats.getPicture` | `unipile.api.chats.getPicture` | `read` | Download a chat's picture (Telegram only). Returns the type and size only, unless include_content is set (then base64, up to max_bytes) |
| `chats.list` | `unipile.api.chats.list` | `read` | List the account's chats, newest first, filtered by type, date, unread or archived. WhatsApp, Telegram and Instagram; on LinkedIn use inboxes.listChats. WhatsApp and Telegram channels, communities and broadcasts are not returned |
| `chats.listParticipants` | `unipile.api.chats.listParticipants` | `read` | List the participants of a group chat (fails on 1-to-1 chats). LinkedIn Classic, WhatsApp, Telegram and Instagram |
| `chats.removeParticipant` | `unipile.api.chats.removeParticipant` | `destructive` | Remove someone from a group chat, or pass the account's own user ID to leave it (the chat becomes read-only). Non-admins on WhatsApp, Telegram and Instagram can get success without a removal |
| `chats.setComposing` | `unipile.api.chats.setComposing` | `write` | Show the 'typing…' or 'recording' indicator in a chat. LinkedIn Classic, WhatsApp and Telegram (Telegram clears it after about 5 seconds) |
| `chats.start` | `unipile.api.chats.start` | `write` | Start a chat on WhatsApp, Telegram or Instagram by sending the first message (an array of users_ids makes a group; an existing 1-to-1 chat just gets the message). On LinkedIn use inboxes.startChat. Never retried after a timeout or 5xx |
| `chats.update` | `unipile.api.chats.update` | `write` | Change a chat: mark it read or unread, archive, mute, rename (groups) or label (WhatsApp Business). Marking read does not mark its messages; Telegram cannot archive |
| `contacts.list` | `unipile.api.contacts.list` | `read` | List the account's contacts on WhatsApp, Gmail or Outlook (not Telegram or IMAP), with paging. A contact does not mean a chat exists |
| `drafts.create` | `unipile.api.drafts.create` | `write` | Save an email draft without sending it; reply drafts use reply_to_message_id. Outlook attachments must be under 3 MB each |
| `drafts.delete` | `unipile.api.drafts.delete` | `destructive` | Delete an email draft permanently |
| `drafts.get` | `unipile.api.drafts.get` | `read` | Get one email draft with its recipients, subject, body and attachment metadata |
| `drafts.list` | `unipile.api.drafts.list` | `read` | List email drafts, newest first (Gmail and Outlook; IMAP answers 501) |
| `drafts.send` | `unipile.api.drafts.send` | `write` | Send an existing draft; the draft is deleted afterwards. Never retried after a timeout or 5xx |
| `drafts.update` | `unipile.api.drafts.update` | `write` | Change an email draft; fields left out stay, but attachments replaces the whole list. Outlook attachments must be under 3 MB each |
| `emails.get` | `unipile.api.emails.get` | `read` | Get one email: headers, sender and recipients, body, folders or labels, and attachment metadata (download with emails.getAttachment) |
| `emails.getAttachment` | `unipile.api.emails.getAttachment` | `read` | Download an email attachment. Returns the type and size only, unless include_content is set (then base64, up to max_bytes) |
| `emails.getThread` | `unipile.api.emails.getThread` | `read` | Get a whole email conversation by the email's thread_id (not its id). IMAP threads are inferred from headers and can be incomplete |
| `emails.list` | `unipile.api.emails.list` | `read` | List emails across folders, newest first, with filters (folder, from, to, date, text) and cursor paging; meta_only skips bodies. Gmail and Outlook; IMAP only with Initial Sync, otherwise use emails.listInFolder |
| `emails.listInFolder` | `unipile.api.emails.listInFolder` | `read` | List the emails in one folder or Gmail label (folder_id from folders.list), newest first. Works on IMAP without Initial Sync |
| `emails.listSenders` | `unipile.api.emails.listSenders` | `read` | List the addresses the account can send from: the main address plus aliases (Gmail; Outlook on Microsoft 365 or Exchange) |
| `emails.markRead` | `unipile.api.emails.markRead` | `write` | Mark an email as read for the account (does not trigger the sender's tracking pixel) |
| `emails.markUnread` | `unipile.api.emails.markUnread` | `write` | Mark an email as unread |
| `emails.modify` | `unipile.api.emails.modify` | `write` | Move an email or set its labels: folders_ids replaces them all (on Gmail list every label to keep; Outlook allows one folder). Archive, junk or flag by moving to the folder with that role |
| `emails.send` | `unipile.api.emails.send` | `write` | Send an email (from must be one of emails.listSenders; reply in-thread with reply_to_message_id), with base64 attachments and optional open/click tracking. Gmail advises 50-100 a day. Never retried after a timeout or 5xx |
| `emails.trash` | `unipile.api.emails.trash` | `destructive` | Move an email to the provider's trash. Permanent deletion is not available |
| `folders.create` | `unipile.api.folders.create` | `write` | Create an email folder or Gmail label. parent_id (sub-folders) is Outlook only; colors are Gmail only |
| `folders.delete` | `unipile.api.folders.delete` | `destructive` | Delete an email folder or label. Gmail keeps the emails (only the label goes); Outlook and IMAP permanently delete every email in the folder |
| `folders.get` | `unipile.api.folders.get` | `read` | Get one email folder or label by its provider ID from folders.list |
| `folders.list` | `unipile.api.folders.list` | `read` | List email folders (Outlook, IMAP) or labels (Gmail) with their role (INBOX, SENT, TRASH, ARCHIVE, JUNK…) and counts, with paging |
| `folders.update` | `unipile.api.folders.update` | `write` | Rename or change an email folder or label; colors are Gmail only, parent_id Outlook only |
| `inboxes.list` | `unipile.api.inboxes.list` | `read` | List a LinkedIn account's inboxes (Classic, Sales Navigator, Recruiter, company pages). Only a product's primary inbox (e.g. CLASSIC_PRIMARY) can start chats |
| `inboxes.listChats` | `unipile.api.inboxes.listChats` | `read` | List the chats in one LinkedIn inbox, newest first. This is how LinkedIn chats are listed (chats.list covers the other providers); Classic and Sales Navigator page by offset, Recruiter by cursor |
| `inboxes.startChat` | `unipile.api.inboxes.startChat` | `write` | Start a LinkedIn chat from a primary inbox (e.g. CLASSIC_PRIMARY) by sending the first message; an existing 1-to-1 chat just gets it. InMail spends credits; Sales Navigator needs a subject. Never retried after a timeout or 5xx |
| `linkedin.endorseSkill` | `unipile.api.linkedin.endorseSkill` | `write` | Endorse a skill of a 1st-degree connection (skill_id from users.getProfile with linkedin_skills). The member is notified and it shows on their profile |
| `linkedin.getCompany` | `unipile.api.linkedin.getCompany` | `read` | Get a LinkedIn company page by numeric ID or URL slug: description, industry, size, locations, website. LinkedIn advises at most 80 a day (150 with Premium), so this is not retried after a timeout or 5xx |
| `linkedin.getCompanyFollowCredits` | `unipile.api.linkedin.getCompanyFollowCredits` | `read` | Get a company page's remaining follow-invitation credits and when they reset |
| `linkedin.getInmailCredits` | `unipile.api.linkedin.getInmailCredits` | `read` | Get how many InMail credits the LinkedIn account has left (classic, sales_navigator or recruiter; all when omitted). Check before an InMail with inboxes.startChat |
| `linkedin.getSearchParameters` | `unipile.api.linkedin.getSearchParameters` | `read` | Look up the IDs LinkedIn searches need (type LOCATION, COMPANY, INDUSTRY, SCHOOL, JOB_TITLE, SKILL… plus keywords; up to 100). Searches, profile views and profile updates take these IDs, not text |
| `linkedin.inviteToFollowCompany` | `unipile.api.linkedin.inviteToFollowCompany` | `write` | Invite 1st-degree connections (ACo… IDs) to follow a company page the account administers. Spends the page's monthly credits; success can be partial (invitations_count), so never resend the whole batch |
| `linkedin.listContracts` | `unipile.api.linkedin.listContracts` | `read` | List the Sales Navigator or Recruiter contracts (seats) the account can use (403 unless that product was activated when the account was linked) |
| `linkedin.listManagedCompanyPages` | `unipile.api.linkedin.listManagedCompanyPages` | `read` | List the LinkedIn company pages the account administers; their IDs work as post_as, comment_as, react_as and for follow invitations |
| `linkedin.listProfileViews` | `unipile.api.linkedin.listProfileViews` | `read` | List who viewed the account's LinkedIn profile, with offset paging and filters (date range, industry, company, location). Without Premium the data is limited and filters are ignored |
| `linkedin.request` | `unipile.api.linkedin.request` | `write` | Advanced: send a raw request to any LinkedIn endpoint through the account's session and get LinkedIn's response as is. Can read or change anything the account can; prefer the typed operations. Never retried after a timeout or 5xx |
| `linkedin.searchCompanies` | `unipile.api.linkedin.searchCompanies` | `read` | Search LinkedIn companies by keywords, location, industry and headcount (IDs from linkedin.getSearchParameters); cursor paging. Counts toward LinkedIn's daily search limit |
| `linkedin.searchFromUrl` | `unipile.api.linkedin.searchFromUrl` | `read` | Run a LinkedIn search from a linkedin.com/search/results/people, /companies or /content URL; page with next_cursor and the same URL. Counts toward LinkedIn's daily search limit (about 1,000 profiles) |
| `linkedin.searchJobs` | `unipile.api.linkedin.searchJobs` | `read` | Search LinkedIn job postings by keywords, company, location, function and title (IDs from linkedin.getSearchParameters); offset paging, up to 100 per page |
| `linkedin.searchPeople` | `unipile.api.linkedin.searchPeople` | `read` | Search LinkedIn people by keywords, location, company, school, industry and network distance (IDs from linkedin.getSearchParameters); 10 per page, cursor paging. LinkedIn advises at most 1,000 profiles a day |
| `linkedin.searchPosts` | `unipile.api.linkedin.searchPosts` | `read` | Search LinkedIn posts by keywords, author or mention (IDs from linkedin.getSearchParameters), to find people engaging with a topic; cursor paging, up to 49 per page. Counts toward the daily search limit |
| `linkedin.selectContract` | `unipile.api.linkedin.selectContract` | `write` | Switch to another Sales Navigator or Recruiter contract; later calls and webhooks for that product use it |
| `messages.addReaction` | `unipile.api.messages.addReaction` | `write` | React to a message with an emoji; the other participants see it. WhatsApp, Telegram and Instagram keep one reaction per person (a new one replaces it); some providers allow only a fixed set |
| `messages.delete` | `unipile.api.messages.delete` | `destructive` | Delete a message the account sent. WhatsApp and Telegram delete it for everyone; some providers leave a 'deleted' placeholder, and WhatsApp can report success outside its time limit without deleting |
| `messages.edit` | `unipile.api.messages.edit` | `write` | Edit the text of a message the account sent. Instagram allows it for 15 minutes; WhatsApp can report success outside its limits without editing |
| `messages.forward` | `unipile.api.messages.forward` | `write` | Forward a message to another chat (to_chat_id). WhatsApp and Telegram ignore the extra text; not on LinkedIn Sales Navigator or Recruiter. Sends immediately and is never retried after a timeout or 5xx |
| `messages.get` | `unipile.api.messages.get` | `read` | Get one message: text, sender, attachments, reactions, and read and delivery state. Not on LinkedIn Sales Navigator or Recruiter |
| `messages.getAttachment` | `unipile.api.messages.getAttachment` | `read` | Download a message attachment. Returns the type and size only, unless include_content is set (then base64, up to max_bytes). Attachments marked is_unavailable cannot be downloaded |
| `messages.list` | `unipile.api.messages.list` | `read` | List the messages in a chat on any provider, newest first, with sender, read and delivery state |
| `messages.listReactions` | `unipile.api.messages.listReactions` | `read` | List who reacted to a message with what. LinkedIn Classic, WhatsApp, Telegram and Instagram (counts are already on the message) |
| `messages.markRead` | `unipile.api.messages.markRead` | `write` | Mark someone else's message as read (the sender may see a read receipt). Does not change the chat's read state; not on LinkedIn Sales Navigator or Recruiter |
| `messages.pin` | `unipile.api.messages.pin` | `write` | Pin or unpin a message (pin_status false unpins). WhatsApp, Telegram and Instagram; WhatsApp pins expire after 24 hours, 7 or 30 days |
| `messages.removeReaction` | `unipile.api.messages.removeReaction` | `destructive` | Remove the account's own reaction from a message (pass the same emoji) |
| `messages.send` | `unipile.api.messages.send` | `write` | Send a message in an existing chat on any provider, optionally with attachments or as a reply (quote_id). WhatsApp sends one attachment per message; LinkedIn caps attachments at 20 MB. Never retried after a timeout or 5xx |
| `posts.addComment` | `unipile.api.posts.addComment` | `write` | Comment on a post, optionally as a managed LinkedIn company page. The comment is public; LinkedIn advises 80-100 a day. Never retried after a timeout or 5xx |
| `posts.addCommentReaction` | `unipile.api.posts.addCommentReaction` | `write` | React to a comment, optionally as a managed company page. The reaction is public |
| `posts.addReaction` | `unipile.api.posts.addReaction` | `write` | React to a post (LinkedIn: like, celebrate, support, love, insightful, funny; Instagram: like). The reaction is public; LinkedIn advises 80-100 reactions and comments a day |
| `posts.create` | `unipile.api.posts.create` | `write` | Publish a post on LinkedIn or Instagram. It goes live publicly right away (Instagram needs media). LinkedIn supports mentions, audience and posting as a managed company page. Never retried after a timeout or 5xx |
| `posts.createStory` | `unipile.api.posts.createStory` | `write` | Publish an Instagram story with exactly one image or video. It goes live publicly right away |
| `posts.delete` | `unipile.api.posts.delete` | `destructive` | Delete a post the account published (Unipile post ID) |
| `posts.deleteComment` | `unipile.api.posts.deleteComment` | `destructive` | Delete a comment the account wrote |
| `posts.get` | `unipile.api.posts.get` | `read` | Get one post by its Unipile ID or a native LinkedIn ID (activity:…, ugcPost:…). LinkedIn post reads count toward a daily limit (about 80-100), so this is not retried after a timeout or 5xx |
| `posts.list` | `unipile.api.posts.list` | `read` | List a user's posts (LinkedIn or Instagram) with reaction, comment and repost counts. LinkedIn post reads count toward a daily limit (about 80-100), so this is not retried after a timeout or 5xx |
| `posts.listCommentReactions` | `unipile.api.posts.listCommentReactions` | `read` | List who reacted to a comment with what (LinkedIn pages by offset) |
| `posts.listCommentReplies` | `unipile.api.posts.listCommentReplies` | `read` | List the replies to a comment, newest first (LinkedIn pages by offset) |
| `posts.listComments` | `unipile.api.posts.listComments` | `read` | List the comments on a post with each author, newest or most relevant first |
| `posts.listReactions` | `unipile.api.posts.listReactions` | `read` | List the people who reacted to a post, with their profile summary, to find engaged leads |
| `posts.removeCommentReaction` | `unipile.api.posts.removeCommentReaction` | `destructive` | Remove the account's reaction from a comment (pass the same reaction) |
| `posts.removeReaction` | `unipile.api.posts.removeReaction` | `destructive` | Remove the account's reaction from a post (pass the same reaction) |
| `posts.replyToComment` | `unipile.api.posts.replyToComment` | `write` | Reply to a comment, optionally as a managed LinkedIn company page. The reply is public. Never retried after a timeout or 5xx |
| `posts.update` | `unipile.api.posts.update` | `write` | Edit a post the account published (Unipile post ID). The change is public |
| `posts.updateComment` | `unipile.api.posts.updateComment` | `write` | Edit a comment the account wrote (LinkedIn only). The change is public |
| `relationRequests.accept` | `unipile.api.relationRequests.accept` | `write` | Accept a LinkedIn invitation the account received |
| `relationRequests.cancel` | `unipile.api.relationRequests.cancel` | `destructive` | Withdraw a sent LinkedIn invitation or decline a received one. LinkedIn may block re-inviting the same person for weeks |
| `relationRequests.create` | `unipile.api.relationRequests.create` | `write` | Send a LinkedIn connection invitation to a member ID (ACo…), with an optional note. LinkedIn allows roughly 100-200 a week; pace sends and never retry a failed one blindly |
| `relationRequests.list` | `unipile.api.relationRequests.list` | `read` | List pending LinkedIn invitations the account sent or received, with the other person and any note |
| `salesNavigator.browseAccountList` | `unipile.api.salesNavigator.browseAccountList` | `read` | List the companies in a Sales Navigator account list, with filters; offset paging |
| `salesNavigator.browseLeadList` | `unipile.api.salesNavigator.browseLeadList` | `read` | List the leads in a Sales Navigator lead list, with filters; offset paging |
| `salesNavigator.getSearchParameters` | `unipile.api.salesNavigator.getSearchParameters` | `read` | Look up the IDs Sales Navigator filters need (type COMPANY, LOCATION, INDUSTRY, JOB_TITLE, PERSONA, LEAD_LIST, saved and recent searches…; up to 100). Needs Sales Navigator |
| `salesNavigator.listAccountLists` | `unipile.api.salesNavigator.listAccountLists` | `read` | List the account's Sales Navigator account (company) lists; offset paging |
| `salesNavigator.listLeadLists` | `unipile.api.salesNavigator.listLeadLists` | `read` | List the account's Sales Navigator lead lists (with several contracts, run linkedin.selectContract first); offset paging |
| `salesNavigator.saveAccount` | `unipile.api.salesNavigator.saveAccount` | `write` | Add a company (company_id from a companies search) to an existing Sales Navigator account list. Lists cannot be created here |
| `salesNavigator.saveLead` | `unipile.api.salesNavigator.saveLead` | `write` | Add a lead (user_id from a people search) to an existing Sales Navigator lead list. Lists cannot be created here |
| `salesNavigator.searchCompanies` | `unipile.api.salesNavigator.searchCompanies` | `read` | Search accounts (companies) in Sales Navigator with include/exclude filters, spotlights and headcount ranges; offset paging, up to 100 per page |
| `salesNavigator.searchFromUrl` | `unipile.api.salesNavigator.searchFromUrl` | `read` | Run a Sales Navigator search from a linkedin.com/sales/search/people or /company URL; offset paging, up to 50 per page. Needs Sales Navigator; LinkedIn advises at most 2,500 profiles a day |
| `salesNavigator.searchPeople` | `unipile.api.salesNavigator.searchPeople` | `read` | Search leads in Sales Navigator with include/exclude filters (IDs from salesNavigator.getSearchParameters) or a saved search; offset paging, up to 100 per page. LinkedIn advises at most 2,500 profiles a day |
| `scopes.create` | `unipile.api.scopes.create` | `write` | Create a Scope to group one customer's accounts. Needs a Service API Key |
| `scopes.delete` | `unipile.api.scopes.delete` | `destructive` | Delete a Scope. Needs a Service API Key |
| `scopes.get` | `unipile.api.scopes.get` | `read` | Get one Scope. Needs a Service API Key |
| `scopes.list` | `unipile.api.scopes.list` | `read` | List the Scopes (customer or workspace boundaries) in the application. Needs a Service API Key |
| `scopes.update` | `unipile.api.scopes.update` | `write` | Rename, enable or disable a Scope. Needs a Service API Key |
| `users.follow` | `unipile.api.users.follow` | `write` | Follow a user on LinkedIn or Instagram (a private profile gets a follow request). Does not create a LinkedIn connection; fails if already followed |
| `users.getChat` | `unipile.api.users.getChat` | `read` | Find the existing chats with a user by their provider ID, on any provider, to send into instead of starting a new one. Can return several chats across inboxes |
| `users.getPicture` | `unipile.api.users.getPicture` | `read` | Download a user's profile picture (Telegram only; me for the owner). Returns the type and size only, unless include_content is set |
| `users.getPresence` | `unipile.api.users.getPresence` | `read` | Get whether a user is online and when they were last seen (Instagram, LinkedIn, Telegram, WhatsApp). unknown means not shared, not offline |
| `users.getProfile` | `unipile.api.users.getProfile` | `read` | Get a LinkedIn profile by member ID or public identifier: headline, location, network distance, invitation status, and optional experience, education and skills. Each call counts toward LinkedIn's profile-view limit (about 80-100 a day), so it is not retried after a timeout or 5xx, only after Unipile's own rate limit |
| `users.listComments` | `unipile.api.users.listComments` | `read` | List a user's comments on posts (the account owner's by default), with each post |
| `users.listFollowers` | `unipile.api.users.listFollowers` | `read` | List a user's followers on LinkedIn or Instagram (me for the owner); LinkedIn pages by offset |
| `users.listFollowing` | `unipile.api.users.listFollowing` | `read` | List the accounts a user follows on LinkedIn or Instagram. LinkedIn accepts only user_id me; pages by offset |
| `users.listReactions` | `unipile.api.users.listReactions` | `read` | List the posts a user reacted to (the account owner's by default), with each post |
| `users.listRelations` | `unipile.api.users.listRelations` | `read` | List a user's 1st-degree connections (the account owner's by default), with optional name search and paging |
| `users.removeRelation` | `unipile.api.users.removeRelation` | `destructive` | Remove a LinkedIn connection (1st-degree relation). Use users.unfollow for one-way follows; reconnecting needs a new invitation |
| `users.setPresence` | `unipile.api.users.setPresence` | `write` | Set the account's own presence: online, offline, away or restricted_online. LinkedIn Classic, WhatsApp, Telegram and Instagram |
| `users.unfollow` | `unipile.api.users.unfollow` | `destructive` | Stop following a user on LinkedIn or Instagram; fails if not followed |
| `users.updateProfile` | `unipile.api.users.updateProfile` | `write` | Update the account owner's own LinkedIn or Instagram profile (user_id me): headline, about, location, skills and similar. Changes are public, and notify_network announces them |
| `users.visitProfile` | `unipile.api.users.visitProfile` | `write` | Report a profile visit to LinkedIn so the member sees you in 'Who viewed your profile', using the notify_visit_token from users.getProfile. Counts toward LinkedIn's profile-view limit and is not retried after a timeout or 5xx |
| `webhookEndpoints.create` | `unipile.api.webhookEndpoints.create` | `write` | Register a URL to receive Unipile events such as relation.new and message.new. Returns the signing secret once, and only here: store it as the plugin webhookSecret right away. Needs a Service API Key |
| `webhookEndpoints.delete` | `unipile.api.webhookEndpoints.delete` | `destructive` | Delete a Unipile webhook endpoint; its events stop. Needs a Service API Key |
| `webhookEndpoints.get` | `unipile.api.webhookEndpoints.get` | `read` | Get one Unipile webhook endpoint: URL, events, accounts and whether it has a signing secret (the secret is never returned). Needs a Service API Key |
| `webhookEndpoints.list` | `unipile.api.webhookEndpoints.list` | `read` | List the Unipile webhook endpoints, their URLs, events and accounts (signing secrets are never returned). Needs a Service API Key |
| `webhookEndpoints.update` | `unipile.api.webhookEndpoints.update` | `write` | Change a webhook endpoint's URL, events, accounts or description, or enable or disable it. Keeps the signing secret, which is not returned. Needs a Service API Key |
| `webhookEvents.listDeliveries` | `unipile.api.webhookEvents.listDeliveries` | `read` | List webhook delivery attempts (event, endpoint, status, response) from the last seven days, to debug missing events. Needs a Service API Key |
| `webhookEvents.replay` | `unipile.api.webhookEvents.replay` | `write` | Queue another delivery of a stored event (evt_…) to every enabled endpoint that matches it, even if it was delivered before. Receivers must handle the duplicate. Needs a Service API Key |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 40 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/unipile

## License

Apache-2.0
