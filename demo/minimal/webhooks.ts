import { processWebhook } from 'corsair';
import express from 'express';
import { corsair } from './corsair';

const app = express();

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
