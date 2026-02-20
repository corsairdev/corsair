# Corsair Plugins

This document lists all available plugins with their webhooks and endpoints.

## Gmail

### Webhooks
- `messageChanged`: triggered when a message is received, deleted, or has labels changed

### Endpoints
- `messagesList`: lists all messages
- `messagesGet`: gets a specific message
- `messagesSend`: sends a message
- `messagesDelete`: deletes a message
- `messagesModify`: modifies message labels
- `messagesBatchModify`: modifies multiple messages at once
- `messagesTrash`: moves a message to trash
- `messagesUntrash`: restores a message from trash
- `labelsList`: lists all labels
- `labelsGet`: gets a specific label
- `labelsCreate`: creates a new label
- `labelsUpdate`: updates a label
- `labelsDelete`: deletes a label
- `draftsList`: lists all email drafts
- `draftsGet`: gets a specific draft
- `draftsCreate`: creates a new draft
- `draftsUpdate`: updates a draft
- `draftsDelete`: deletes a draft
- `draftsSend`: sends a draft
- `threadsList`: lists all threads
- `threadsGet`: gets a specific thread
- `threadsModify`: modifies thread labels
- `threadsDelete`: deletes a thread
- `threadsTrash`: moves a thread to trash
- `threadsUntrash`: restores a thread from trash
- `usersGetProfile`: gets user profile information

## GitHub

### Webhooks
- `pullRequestOpened`: triggered when a pull request is opened
- `pullRequestClosed`: triggered when a pull request is closed
- `pullRequestSynchronize`: triggered when a pull request is synchronized
- `push`: triggered when code is pushed to a repository
- `starCreated`: triggered when a repository is starred
- `starDeleted`: triggered when a star is removed from a repository

### Endpoints
- `issuesList`: lists all issues
- `issuesGet`: gets a specific issue
- `issuesCreate`: creates a new issue
- `issuesUpdate`: updates an issue
- `issuesCreateComment`: creates a comment on an issue
- `pullRequestsList`: lists all pull requests
- `pullRequestsGet`: gets a specific pull request
- `pullRequestsListReviews`: lists reviews for a pull request
- `pullRequestsCreateReview`: creates a review on a pull request
- `repositoriesList`: lists all repositories
- `repositoriesGet`: gets a specific repository
- `repositoriesListBranches`: lists branches in a repository
- `repositoriesListCommits`: lists commits in a repository
- `repositoriesGetContent`: gets file or directory contents
- `releasesList`: lists all releases
- `releasesGet`: gets a specific release
- `releasesCreate`: creates a new release
- `releasesUpdate`: updates a release
- `workflowsList`: lists all workflows
- `workflowsGet`: gets a specific workflow
- `workflowsListRuns`: lists workflow runs

## HubSpot

### Webhooks
- `contactCreated`: triggered when a contact is created
- `contactUpdated`: triggered when a contact is updated
- `contactDeleted`: triggered when a contact is deleted
- `companyCreated`: triggered when a company is created
- `companyUpdated`: triggered when a company is updated
- `companyDeleted`: triggered when a company is deleted
- `dealCreated`: triggered when a deal is created
- `dealUpdated`: triggered when a deal is updated
- `dealDeleted`: triggered when a deal is deleted
- `ticketCreated`: triggered when a ticket is created
- `ticketUpdated`: triggered when a ticket is updated
- `ticketDeleted`: triggered when a ticket is deleted

### Endpoints
- `contactsGet`: gets a specific contact
- `contactsGetMany`: gets multiple contacts
- `contactsCreateOrUpdate`: creates or updates a contact
- `contactsDelete`: deletes a contact
- `contactsGetRecentlyCreated`: gets recently created contacts
- `contactsGetRecentlyUpdated`: gets recently updated contacts
- `contactsSearch`: searches for contacts
- `companiesGet`: gets a specific company
- `companiesGetMany`: gets multiple companies
- `companiesCreate`: creates a new company
- `companiesUpdate`: updates a company
- `companiesDelete`: deletes a company
- `companiesGetRecentlyCreated`: gets recently created companies
- `companiesGetRecentlyUpdated`: gets recently updated companies
- `companiesSearchByDomain`: searches for companies by domain
- `dealsGet`: gets a specific deal
- `dealsGetMany`: gets multiple deals
- `dealsCreate`: creates a new deal
- `dealsUpdate`: updates a deal
- `dealsDelete`: deletes a deal
- `dealsGetRecentlyCreated`: gets recently created deals
- `dealsGetRecentlyUpdated`: gets recently updated deals
- `dealsSearch`: searches for deals
- `ticketsGet`: gets a specific ticket
- `ticketsGetMany`: gets multiple tickets
- `ticketsCreate`: creates a new ticket
- `ticketsUpdate`: updates a ticket
- `ticketsDelete`: deletes a ticket
- `engagementsGet`: gets a specific engagement
- `engagementsGetMany`: gets multiple engagements
- `engagementsCreate`: creates a new engagement
- `engagementsDelete`: deletes an engagement
- `contactListsAddContact`: adds a contact to a list
- `contactListsRemoveContact`: removes a contact from a list

## Linear

### Webhooks
- `issueCreate`: triggered when an issue is created
- `issueUpdate`: triggered when an issue is updated
- `issueRemove`: triggered when an issue is removed
- `commentCreate`: triggered when a comment is created
- `commentUpdate`: triggered when a comment is updated
- `commentRemove`: triggered when a comment is removed
- `projectCreate`: triggered when a project is created
- `projectUpdate`: triggered when a project is updated
- `projectRemove`: triggered when a project is removed

### Endpoints
- `issuesList`: lists all issues
- `issuesGet`: gets a specific issue
- `issuesCreate`: creates a new issue
- `issuesUpdate`: updates an issue
- `issuesDelete`: deletes an issue
- `teamsList`: lists all teams
- `teamsGet`: gets a specific team
- `projectsList`: lists all projects
- `projectsGet`: gets a specific project
- `projectsCreate`: creates a new project
- `projectsUpdate`: updates a project
- `projectsDelete`: deletes a project
- `commentsList`: lists all comments for an issue
- `commentsCreate`: creates a new comment
- `commentsUpdate`: updates a comment
- `commentsDelete`: deletes a comment

## PostHog

### Webhooks
- `eventCaptured`: triggered when an event is captured

### Endpoints
- `aliasCreate`: creates an alias for a distinct ID
- `eventCreate`: creates a new event
- `identityCreate`: creates or updates an identity
- `trackPage`: tracks a page view
- `trackScreen`: tracks a screen view

## Resend

### Webhooks
- `emailSent`: triggered when an email is sent
- `emailDelivered`: triggered when an email is delivered
- `emailBounced`: triggered when an email bounces
- `emailOpened`: triggered when an email is opened
- `emailClicked`: triggered when an email link is clicked
- `emailComplained`: triggered when an email receives a complaint
- `emailFailed`: triggered when an email fails to send
- `emailReceived`: triggered when an email is received
- `domainCreated`: triggered when a domain is created
- `domainUpdated`: triggered when a domain is updated

### Endpoints
- `emailsSend`: sends an email
- `emailsGet`: gets a specific email
- `emailsList`: lists all emails
- `domainsCreate`: creates a new domain
- `domainsGet`: gets a specific domain
- `domainsList`: lists all domains
- `domainsDelete`: deletes a domain
- `domainsVerify`: verifies a domain

## Slack

### Webhooks
- `challenge`: handles Slack URL verification challenge
- `reactionAdded`: triggered when a reaction is added
- `message`: triggered when a message is received
- `channelCreated`: triggered when a channel is created
- `teamJoin`: triggered when a user joins the team
- `userChange`: triggered when a user's information changes
- `fileCreated`: triggered when a file is created
- `filePublic`: triggered when a file is made public
- `fileShared`: triggered when a file is shared

### Endpoints
- `channelsRandom`: gets a random channel
- `channelsArchive`: archives a channel
- `channelsClose`: closes a direct message channel
- `channelsCreate`: creates a new channel
- `channelsGet`: gets information about a channel
- `channelsList`: lists all channels
- `channelsGetHistory`: gets message history for a channel
- `channelsInvite`: invites users to a channel
- `channelsJoin`: joins a channel
- `channelsKick`: removes a user from a channel
- `channelsLeave`: leaves a channel
- `channelsGetMembers`: gets members of a channel
- `channelsOpen`: opens a direct message channel
- `channelsRename`: renames a channel
- `channelsGetReplies`: gets replies to a message
- `channelsSetPurpose`: sets the purpose of a channel
- `channelsSetTopic`: sets the topic of a channel
- `channelsUnarchive`: unarchives a channel
- `usersGet`: gets information about a user
- `usersList`: lists all users
- `usersGetProfile`: gets a user's profile
- `usersGetPresence`: gets a user's presence status
- `usersUpdateProfile`: updates a user's profile
- `userGroupsCreate`: creates a user group
- `userGroupsDisable`: disables a user group
- `userGroupsEnable`: enables a user group
- `userGroupsList`: lists all user groups
- `userGroupsUpdate`: updates a user group
- `filesGet`: gets information about a file
- `filesList`: lists all files
- `filesUpload`: uploads a file
- `messagesDelete`: deletes a message
- `messagesGetPermalink`: gets a permalink for a message
- `messagesSearch`: searches for messages
- `postMessage`: posts a message to a channel
- `messagesUpdate`: updates a message
- `reactionsAdd`: adds a reaction to a message
- `reactionsGet`: gets reactions for a message
- `reactionsRemove`: removes a reaction from a message
- `starsAdd`: adds a star to an item
- `starsRemove`: removes a star from an item
- `starsList`: lists all starred items

