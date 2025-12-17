# OAuth Token Helper

A simple local development tool for obtaining OAuth tokens from various services like Spotify, GitHub, Slack, Google, and Discord. This tool provides a web interface where you can select a service, enter your client credentials, and get OAuth tokens through a popup authentication flow.

## Features

- **Multiple OAuth Providers**: Supports Spotify, GitHub, Slack, Google, and Discord
- **Dynamic Instructions**: Shows service-specific setup instructions with the correct redirect URI
- **Local Development**: Designed for localhost/127.0.0.1 usage only
- **Token Display**: Shows both access tokens and refresh tokens (when available)
- **Copy to Clipboard**: Easy copying of tokens from the success page

## Quick Start

1. **Install dependencies**:
   ```bash
   cd oauth-token-helper
   npm install
   cd server && npm install
   cd ../client && npm install
   cd ..
   ```

2. **Start the application**:
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://127.0.0.1:3001`
   - Frontend client on `http://localhost:3000`

3. **Open your browser** and go to `http://localhost:3000`

## How to Use

1. **Select a service** from the dropdown (Spotify, GitHub, etc.)
2. **Read the setup instructions** that appear below the form
3. **Configure your OAuth app** in the service's developer console using the provided redirect URI
4. **Enter your Client ID and Client Secret** in the form
5. **Click "Authenticate"** to start the OAuth flow
6. **Complete authentication** in the popup window
7. **Copy your tokens** from the success page

## Service Configuration

The application uses a CMS-style configuration in `shared/oauth-services.ts` where each service is defined with:

- Display name and labels
- OAuth URLs (authorization and token endpoints)
- Required scopes
- Setup instructions with dynamic redirect URI
- Service-specific requirements (state parameter, refresh tokens, etc.)

### Adding New Services

To add a new OAuth service, simply add an entry to the `OAUTH_SERVICES` object in `shared/oauth-services.ts`:

```typescript
newservice: {
  name: 'newservice',
  displayName: 'New Service',
  authUrl: 'https://api.newservice.com/oauth/authorize',
  tokenUrl: 'https://api.newservice.com/oauth/token',
  scope: 'read write',
  clientIdLabel: 'Application ID',
  clientSecretLabel: 'Application Secret',
  requiresState: true,
  usesRefreshToken: true,
  setupInstructions: (redirectUri: string) => `
Setup instructions for New Service:
1. Go to developer console
2. Add ${redirectUri} as redirect URI
3. Copy credentials
  `.trim()
}
```

## Supported Services

### Spotify
- **Redirect URI**: Uses 127.0.0.1 (required by Spotify)
- **Scopes**: User profile and playlist access
- **Refresh Tokens**: Yes

### GitHub
- **Redirect URI**: Works with both localhost and 127.0.0.1
- **Scopes**: Repository and user access
- **Refresh Tokens**: No

### Slack
- **Redirect URI**: Standard OAuth flow
- **Scopes**: Channel and user read access
- **Refresh Tokens**: Yes

### Google
- **Redirect URI**: Allows localhost for development
- **Scopes**: Basic profile information
- **Refresh Tokens**: Yes

### Discord
- **Redirect URI**: Standard OAuth flow
- **Scopes**: Identity and email access
- **Refresh Tokens**: Yes

## Important Notes

- **Local Use Only**: This tool is designed for local development only
- **Security**: Never commit real client secrets to version control
- **Port Configuration**: The server runs on port 3001 by default, which is used in the redirect URIs
- **Popup Blockers**: Make sure popup blockers are disabled for localhost

## Project Structure

```
oauth-token-helper/
├── package.json              # Root package with scripts
├── shared/
│   └── oauth-services.ts     # CMS-style service definitions
├── server/
│   ├── package.json         # Server dependencies
│   ├── tsconfig.json        # TypeScript config
│   └── src/
│       └── server.ts        # Express server with OAuth handling
└── client/
    ├── package.json         # Client dependencies
    ├── tsconfig.json        # TypeScript config
    ├── vite.config.ts       # Vite configuration
    └── src/
        ├── main.tsx         # React entry point
        ├── App.tsx          # Main application component
        ├── App.css          # Application styles
        └── index.css        # Global styles
```

## Development

- **Backend**: Express.js with TypeScript, runs on port 3001
- **Frontend**: React + Vite with TypeScript, runs on port 3000
- **Shared**: TypeScript definitions for OAuth services

The frontend proxies API requests to the backend, so you can access everything through `http://localhost:3000`.

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**: Make sure you've added the exact redirect URI shown in the instructions to your OAuth app settings

2. **Popup blocked**: Allow popups for localhost in your browser settings

3. **CORS errors**: The server includes CORS headers, but make sure you're accessing through the correct ports

4. **Token exchange failed**: Check that your client ID and secret are correct and that your OAuth app is configured properly

### Getting Help

Check the browser console and server logs for detailed error messages. Most issues are related to OAuth app configuration in the service's developer console.