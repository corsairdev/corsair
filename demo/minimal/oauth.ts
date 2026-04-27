import {
	generateOAuthUrl,
	processOAuthCallback,
} from 'corsair/oauth';
import express from 'express';
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

/**
 * GET /connect/:plugin
 *
 * Initiates OAuth for a tenant. In a real app, tenantId would come from
 * your session/auth middleware.
 *
 * Example: GET /connect/slack?tenantId=acme
 */
app.get('/connect/:plugin', async (req, res) => {
	const pluginId = req.params.plugin;
	const tenantId = (req.query.tenantId as string | undefined) ?? 'default';

	try {
		const { url, state } = await generateOAuthUrl(corsair, pluginId, {
			tenantId,
			redirectUri: REDIRECT_URI,
		});

		// In production: persist `state` in a session or signed cookie
		// so you can verify it in the callback below.
		// Here we pass it via the provider's redirect (it comes back as ?state=).
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
 * Exchanges the code for tokens and stores them for the tenant.
 */
app.get('/api/auth', async (req, res) => {
	const code = req.query.code as string | undefined;
	const state = req.query.state as string | undefined;
	const error = req.query.error as string | undefined;

	if (error) {
		res.status(400).send(
			`<html><body><h2>Authorization failed</h2><p>${escapeHtml(error)}</p></body></html>`,
		);
		return;
	}

	if (!code || !state) {
		res.status(400).send('<p>Missing code or state parameter.</p>');
		return;
	}

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
		res.status(500).send(
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
