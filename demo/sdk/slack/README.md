# Slack SDK

A TypeScript SDK for the Slack API with Zod validation.

## Installation

```bash
npm install
```

## Configuration

### Getting Your Slack Credentials

Follow these steps to obtain the necessary tokens and IDs from your Slack workspace:

#### Step 1: Create a Slack App

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click **"Create New App"**
3. Choose **"From scratch"**
4. Enter an App Name (e.g., "My SDK App")
5. Select your workspace
6. Click **"Create App"**

#### Step 2: Configure Bot Token Scopes

1. In your app settings, go to **"OAuth & Permissions"** in the left sidebar
2. Scroll down to **"Scopes"** section
3. Under **"Bot Token Scopes"**, click **"Add an OAuth Scope"**
4. Add the following scopes based on what you need:

| Scope | Description | Required For |
|-------|-------------|--------------|
| `channels:read` | View basic channel info | Listing channels |
| `channels:write` | Manage channels | Creating/archiving channels |
| `channels:history` | View messages in channels | Getting channel history |
| `chat:write` | Send messages | Posting messages |
| `groups:read` | View private channels | Listing private channels |
| `groups:write` | Manage private channels | Creating private channels |
| `im:read` | View direct messages | Listing DMs |
| `im:write` | Start direct messages | Opening DMs |
| `mpim:read` | View group DMs | Listing group DMs |
| `users:read` | View users | Getting user info |
| `users:read.email` | View email addresses | Getting user emails |
| `usergroups:read` | View user groups | Listing user groups |
| `usergroups:write` | Manage user groups | Creating user groups |
| `files:read` | View files | Getting file info |
| `files:write` | Upload files | Uploading files |
| `reactions:read` | View reactions | Getting reactions |
| `reactions:write` | Add/remove reactions | Adding reactions |
| `stars:read` | View starred items | Listing stars |
| `stars:write` | Add/remove stars | Managing stars |

#### Step 3: Install App to Workspace

1. Go to **"OAuth & Permissions"**
2. Click **"Install to Workspace"** at the top
3. Review the permissions and click **"Allow"**
4. Copy the **"Bot User OAuth Token"** (starts with `xoxb-`)

#### Step 4: Get User Token (Optional)

For some APIs like `search.messages`, you need a User Token:

1. Go to **"OAuth & Permissions"**
2. Under **"User Token Scopes"**, add:
   - `search:read` - For searching messages
3. Reinstall the app if needed
4. Copy the **"User OAuth Token"** (starts with `xoxp-`)

#### Step 5: Find Channel and User IDs

**To find a Channel ID:**
1. Open Slack in your browser or desktop app
2. Right-click on a channel name
3. Click **"View channel details"** or **"Copy link"**
4. The Channel ID is in the URL: `https://app.slack.com/client/TXXXXX/C0123456789`
   - The ID starting with `C` is your Channel ID

**Alternative method:**
1. Open the channel
2. Click the channel name at the top
3. Scroll to the bottom of the modal
4. The Channel ID is displayed there

**To find a User ID:**
1. Click on a user's profile
2. Click the **"..."** (More) button
3. Click **"Copy member ID"**
   - Or find it in the profile URL: `https://app.slack.com/team/U0123456789`

#### Step 6: Create Environment File

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your values:
   ```env
   SLACK_BOT_TOKEN=xoxb-your-actual-bot-token
   SLACK_USER_TOKEN=xoxp-your-actual-user-token
   TEST_SLACK_CHANNEL=C0123456789
   TEST_SLACK_USER=U0123456789
   ```

## Usage

### Basic Usage

```typescript
import { Slack, OpenAPI } from '@corsair/slack-sdk';

// Configure the token
OpenAPI.TOKEN = process.env.SLACK_BOT_TOKEN;

// List channels
const channels = await Slack.Channels.list({ limit: 10 });
console.log(channels);

// Send a message
const message = await Slack.Messages.send({
  channel: 'C0123456789',
  text: 'Hello from the SDK!',
});
console.log(message);

// Get user info
const user = await Slack.Users.get({ user: 'U0123456789' });
console.log(user);
```

### Available APIs

- **Slack.Channels** - Channel management (archive, create, get, list, invite, etc.)
- **Slack.Users** - User information (get, list, getProfile, getPresence, updateProfile)
- **Slack.Usergroups** - User group management (create, disable, enable, list, update)
- **Slack.Files** - File operations (get, list, upload)
- **Slack.Messages** - Messaging (send, update, delete, search, getPermalink)
- **Slack.Reactions** - Reaction management (add, get, remove)
- **Slack.Stars** - Star management (add, remove, list)

### With Zod Validation

All request arguments have Zod schemas for validation:

```typescript
import { ChatPostMessageArgsSchema } from '@corsair/slack-sdk';

const args = {
  channel: 'C0123456789',
  text: 'Hello!',
};

// Validate before sending
const result = ChatPostMessageArgsSchema.safeParse(args);
if (result.success) {
  await Slack.Messages.send(result.data);
} else {
  console.error('Validation failed:', result.error);
}
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run only model validation tests (no token required)
npm test -- models.test.ts
```

## API Reference

### Channels

| Method | Description |
|--------|-------------|
| `Slack.Channels.archive(args)` | Archive a channel |
| `Slack.Channels.close(args)` | Close a direct message |
| `Slack.Channels.create(args)` | Create a channel |
| `Slack.Channels.get(args)` | Get channel info |
| `Slack.Channels.list(args)` | List channels |
| `Slack.Channels.getHistory(args)` | Get channel message history |
| `Slack.Channels.invite(args)` | Invite users to a channel |
| `Slack.Channels.join(args)` | Join a channel |
| `Slack.Channels.kick(args)` | Remove a user from a channel |
| `Slack.Channels.leave(args)` | Leave a channel |
| `Slack.Channels.getMembers(args)` | Get channel members |
| `Slack.Channels.open(args)` | Open a direct message |
| `Slack.Channels.rename(args)` | Rename a channel |
| `Slack.Channels.getReplies(args)` | Get thread replies |
| `Slack.Channels.setPurpose(args)` | Set channel purpose |
| `Slack.Channels.setTopic(args)` | Set channel topic |
| `Slack.Channels.unarchive(args)` | Unarchive a channel |

### Users

| Method | Description |
|--------|-------------|
| `Slack.Users.get(args)` | Get user info |
| `Slack.Users.list(args)` | List users |
| `Slack.Users.getProfile(args)` | Get user profile |
| `Slack.Users.getPresence(args)` | Get user presence |
| `Slack.Users.updateProfile(args)` | Update user profile |

### Messages

| Method | Description |
|--------|-------------|
| `Slack.Messages.send(args)` | Send a message |
| `Slack.Messages.update(args)` | Update a message |
| `Slack.Messages.delete(args)` | Delete a message |
| `Slack.Messages.search(args)` | Search messages |
| `Slack.Messages.getPermalink(args)` | Get message permalink |

### Reactions

| Method | Description |
|--------|-------------|
| `Slack.Reactions.add(args)` | Add a reaction |
| `Slack.Reactions.get(args)` | Get reactions |
| `Slack.Reactions.remove(args)` | Remove a reaction |

### Stars

| Method | Description |
|--------|-------------|
| `Slack.Stars.add(args)` | Star an item |
| `Slack.Stars.remove(args)` | Unstar an item |
| `Slack.Stars.list(args)` | List starred items |

### Files

| Method | Description |
|--------|-------------|
| `Slack.Files.get(args)` | Get file info |
| `Slack.Files.list(args)` | List files |
| `Slack.Files.upload(args)` | Upload a file |

### Usergroups

| Method | Description |
|--------|-------------|
| `Slack.Usergroups.create(args)` | Create a user group |
| `Slack.Usergroups.disable(args)` | Disable a user group |
| `Slack.Usergroups.enable(args)` | Enable a user group |
| `Slack.Usergroups.list(args)` | List user groups |
| `Slack.Usergroups.update(args)` | Update a user group |

## License

MIT

