import { processWebhook } from 'corsair';
import express from 'express';
import { corsair } from './corsair';

const app = express();
app.use(express.json());

const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;

app.get('/webhooks', (req, res) => {
	const mode = req.query['hub.mode'];
	const verifyToken = req.query['hub.verify_token'];
	const challenge = req.query['hub.challenge'];

	if (typeof META_VERIFY_TOKEN !== 'string' || META_VERIFY_TOKEN.length === 0) {
		return res.status(503).send('Webhook verification is not configured');
	}

	if (
		mode === 'subscribe' &&
		typeof verifyToken === 'string' &&
		verifyToken === META_VERIFY_TOKEN &&
		typeof challenge === 'string'
	) {
		return res.status(200).send(challenge);
	}

	return res.status(403).send('Forbidden');
});

// Single webhook endpoint for ALL integrations
// Corsair automatically routes to the right plugin
app.post('/webhooks', async (req, res) => {
	// Extract tenant ID from query params (optional)
	const tenantId = req.query.tenantId as string | undefined;

	// Process the webhook - one function handles everything!
	// The list of plugins in createCorsair will subscribe to these webhooks
	const result = await processWebhook(corsair, req.headers, req.body, {
		tenantId,
	});

	// Return the response (or 200 OK if no response needed)
	if (result.response) {
		return res.json(result.response);
	}
});
