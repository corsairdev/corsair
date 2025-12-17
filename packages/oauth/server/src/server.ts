import axios from 'axios';
import cors from 'cors';
import express from 'express';
import { getService, OAUTH_SERVICES } from './oauth-services';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pendingAuths = new Map<
	string,
	{ service: string; clientId: string; clientSecret: string; scopes: string[] }
>();

app.get('/api/services', (req, res) => {
	const services = Object.values(OAUTH_SERVICES).map((service) => ({
		name: service.name,
		displayName: service.displayName,
		clientIdLabel: service.clientIdLabel,
		clientSecretLabel: service.clientSecretLabel,
		scopes: service.scopes,
		setupInstructions: service.setupInstructions(
			`http://127.0.0.1:${PORT}/api/callback`,
		),
	}));

	res.json(services);
});

app.post('/api/auth', (req, res) => {
	const { service: serviceName, clientId, clientSecret, scopes } = req.body;

	if (!serviceName || !clientId || !clientSecret) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	const service = getService(serviceName);
	if (!service) {
		return res.status(400).json({ error: 'Invalid service' });
	}

	// Use provided scopes or default to all available scopes
	const selectedScopes =
		scopes && Array.isArray(scopes) && scopes.length > 0
			? scopes
			: service.scopes;

	const state = Math.random().toString(36).substring(2, 15);
	pendingAuths.set(state, {
		service: serviceName,
		clientId,
		clientSecret,
		scopes: selectedScopes,
	});

	const redirectUri = `http://127.0.0.1:${PORT}/api/callback`;
	const params = new URLSearchParams({
		client_id: clientId,
		response_type: 'code',
		redirect_uri: redirectUri,
		scope: selectedScopes.join(' '),
	});

	if (service.requiresState) {
		params.append('state', state);
	}

	const authUrl = `${service.authUrl}?${params.toString()}`;

	res.json({ authUrl, state });
});

app.get('/api/callback', async (req, res) => {
	const { code, state, error } = req.query;

	if (error) {
		return res.send(`
      <html>
        <body>
          <h2>Authorization Error</h2>
          <p>Error: ${error}</p>
          <p>Description: ${req.query.error_description || 'Unknown error'}</p>
          <button onclick="window.close()">Close Window</button>
        </body>
      </html>
    `);
	}

	if (!code) {
		return res.status(400).send(`
      <html>
        <body>
          <h2>Error</h2>
          <p>No authorization code received</p>
          <button onclick="window.close()">Close Window</button>
        </body>
      </html>
    `);
	}

	const authData = pendingAuths.get(state as string);
	if (!authData) {
		return res.status(400).send(`
      <html>
        <body>
          <h2>Error</h2>
          <p>Invalid or expired authorization session</p>
          <button onclick="window.close()">Close Window</button>
        </body>
      </html>
    `);
	}

	const service = getService(authData.service);
	if (!service) {
		return res.status(400).send(`
      <html>
        <body>
          <h2>Error</h2>
          <p>Invalid service configuration</p>
          <button onclick="window.close()">Close Window</button>
        </body>
      </html>
    `);
	}

	try {
		const redirectUri = `http://127.0.0.1:${PORT}/api/callback`;
		const tokenData = {
			grant_type: 'authorization_code',
			code: code as string,
			redirect_uri: redirectUri,
			client_id: authData.clientId,
			client_secret: authData.clientSecret,
		};

		const response = await axios.post(service.tokenUrl, tokenData, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json',
			},
		});

		pendingAuths.delete(state as string);

		const { access_token, refresh_token, expires_in, token_type } =
			response.data;

		res.send(`
      <html>
        <head>
          <title>OAuth Success</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .container { max-width: 800px; margin: 0 auto; }
            .success { color: #28a745; }
            .token-container { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .token { word-break: break-all; font-family: monospace; background: #e9ecef; padding: 10px; border-radius: 4px; }
            button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 5px; }
            button:hover { background: #0056b3; }
            .copy-button { background: #28a745; }
            .copy-button:hover { background: #1e7e34; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="success">🎉 Authorization Successful!</h2>
            <p>Successfully obtained tokens for <strong>${service.displayName}</strong></p>

            <div class="token-container">
              <h3>Access Token:</h3>
              <div class="token" id="access-token">${access_token}</div>
              <button class="copy-button" onclick="copyToClipboard('access-token')">Copy Access Token</button>
            </div>

            ${
							refresh_token
								? `
              <div class="token-container">
                <h3>Refresh Token:</h3>
                <div class="token" id="refresh-token">${refresh_token}</div>
                <button class="copy-button" onclick="copyToClipboard('refresh-token')">Copy Refresh Token</button>
              </div>
            `
								: ''
						}

            <div class="token-container">
              <h3>Additional Info:</h3>
              <p><strong>Token Type:</strong> ${token_type || 'Bearer'}</p>
              ${expires_in ? `<p><strong>Expires In:</strong> ${expires_in} seconds</p>` : ''}
            </div>

            <button onclick="window.close()">Close Window</button>
          </div>

          <script>
            function copyToClipboard(elementId) {
              const element = document.getElementById(elementId);
              const textArea = document.createElement('textarea');
              textArea.value = element.textContent;
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand('copy');
              document.body.removeChild(textArea);

              const button = event.target;
              const originalText = button.textContent;
              button.textContent = 'Copied!';
              setTimeout(() => {
                button.textContent = originalText;
              }, 2000);
            }

            // Auto-focus the window
            window.focus();
          </script>
        </body>
      </html>
    `);
	} catch (error) {
		console.error('Token exchange error:', error);
		pendingAuths.delete(state as string);

		const errorMessage =
			axios.isAxiosError(error) && error.response?.data
				? JSON.stringify(error.response.data, null, 2)
				: error instanceof Error
					? error.message
					: 'Unknown error occurred';

		res.status(500).send(`
      <html>
        <body>
          <h2>Token Exchange Failed</h2>
          <p>Failed to exchange authorization code for access token</p>
          <pre>${errorMessage}</pre>
          <button onclick="window.close()">Close Window</button>
        </body>
      </html>
    `);
	}
});

app.listen(PORT, () => {
	console.log(`OAuth helper server running on http://127.0.0.1:${PORT}`);
	console.log(
		`Redirect URI for OAuth apps: http://127.0.0.1:${PORT}/api/callback`,
	);
});
