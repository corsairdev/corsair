# Corsair — Use Fly.io to Connect ChatGPT, Claude

A single Fly.io deployment that runs your Corsair instance. One password-protected dashboard where you install plugins, connect credentials, and manage permissions. External AI clients (Claude.ai, ChatGPT) connect via MCP.

## Deployment
> You'll have to set up a Fly.io instance

Clone just this directory using Git sparse checkout (no need to download the full repo):

```bash
git clone --filter=blob:none --sparse https://github.com/corsairdev/corsair
cd corsair
git sparse-checkout set fly
cd fly
```

Then run the deploy script:

```bash
./deploy.sh
```

The script picks an app name, generates the secrets, creates Fly Postgres, attaches it, creates the workspace volume, sets all secrets, and deploys. After it finishes, sign in at `https://<app>.fly.dev` with your `APP_PASSWORD`.

## Security

The setup script asks you to choose a password during setup. That password is how you'll access your custom site. Make sure you remember it. If you forget it, you can reset the env var and redeploy the app.

You can choose between `open`, `cautious`, `strict`, and `readonly` for permissioning for each plugin. 

`open`: All operations allowed
`cautious`: Reads and writes are allowed; destructive actions require approval
`strict`: Reads are allowed; writes require your approval; destructive actions are blocked
`readonly`: Only read operations are allowed; all writes and destructive actions are blocked

## Cost

Fly.io is a paid service. This full configuration should be <$3 per month max. 