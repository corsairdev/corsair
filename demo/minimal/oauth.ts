import { generateOAuthUrl, processOAuthCallback } from 'corsair/oauth';
import express from 'express';

/**
 * Import your own corsair instance here.
 * The plugin you connect must have oauthConfig defined
 * (e.g. googlecalendar, gmail, notion, spotify — NOT slack or linear).
 */
import { corsair } from './corsair';

// ─────────────────────────────────────────────────────────────────────────────
// Helper — escape user-controlled values before inserting into HTML
// ─────────────────────────────────────────────────────────────────────────────

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;');
}

// ─────────────────────────────────────────────────────────────────────────────
// Express app
// ─────────────────────────────────────────────────────────────────────────────

const app = express();

const REDIRECT_URI = `${process.env.APP_URL ?? 'http://localhost:3000'}/api/auth`;

// Pending OAuth states — prevents CSRF by ensuring the callback state
// was issued by this server. Use Redis or sessions in production.
const pendingStates = new Set<string>();

/**
 * GET /connect/:plugin?tenantId=<id>
 *
 * Initiates OAuth for a tenant. In a real app, tenantId comes from
 * your session/auth middleware.
 *
 * Example: GET /connect/googlecalendar?tenantId=acme
 */
app.get('/connect/:plugin', async (req, res) => {
	const pluginId = req.params.plugin;
	const tenantId = (req.query.tenantId as string | undefined) ?? 'default';

	try {
		const { url, state } = await generateOAuthUrl(corsair, pluginId, {
			tenantId,
			redirectUri: REDIRECT_URI,
		});

		pendingStates.add(state);
		res.redirect(url);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		res.status(400).send(`<p>${escapeHtml(message)}</p>`);
	}
});

/**
 * GET /api/auth
 *
 * OAuth callback — the provider redirects here with ?code= and ?state=.
 * Verifies state, exchanges the code for tokens, stores them for the tenant.
 */
app.get('/api/auth', async (req, res) => {
	const code = req.query.code as string | undefined;
	const state = req.query.state as string | undefined;
	const error = req.query.error as string | undefined;

	if (error) {
		res
			.status(400)
			.send(
				`<html><body><h2>Authorization failed</h2><p>${escapeHtml(error)}</p></body></html>`,
			);
		return;
	}

	if (!code || !state) {
		res.status(400).send('<p>Missing code or state parameter.</p>');
		return;
	}

	if (!pendingStates.has(state)) {
		res.status(400).send('<p>Invalid state. Possible CSRF attempt.</p>');
		return;
	}
	pendingStates.delete(state);

	try {
		const result = await processOAuthCallback(corsair, {
			code,
			state,
			redirectUri: REDIRECT_URI,
		});

		res.send(
			`<html><body><h2>Connected!</h2>` +
				`<p>Plugin <strong>${escapeHtml(result.plugin)}</strong> ` +
				`authorized for tenant <strong>${escapeHtml(result.tenantId)}</strong>.</p>` +
				`<p>You can close this tab.</p></body></html>`,
		);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		res
			.status(500)
			.send(
				`<html><body><h2>OAuth error</h2><p>${escapeHtml(message)}</p></body></html>`,
			);
	}
});

app.listen(3000, () => {
	console.log('OAuth demo listening on http://localhost:3000');
	console.log(
		'Connect a plugin: http://localhost:3000/connect/<pluginId>?tenantId=<id>',
	);
});
