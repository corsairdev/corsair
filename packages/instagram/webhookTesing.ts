import { processWebhook } from 'corsair';
import express from 'express';
import type { Request, Response } from 'express';
import { corsair } from './corsair';

const app = express();

app.use(express.json({
    verify: (req: any, _res, buf) => {
        req.rawBody = buf.toString('utf8');
    },
}));

app.get('/webhooks', async (req, res) => {

	const body = {
    type: 'url_verification',
    mode: req.query['hub.mode'],
    verify_token: req.query['hub.verify_token'],
    challenge: req.query['hub.challenge'],
  };

  const tenantId = req.query.tenantId as string | undefined;
  const result = await processWebhook(corsair, req.headers, body, {
		tenantId,
	});

	if(result.response?.success) {
		const data = result.response as ({
			challenge: string,
			success: boolean
		});
		return res.status(200).send(data.challenge);
	}

	return res.status(403).send('Forbidden');
});

// Single webhook endpoint for ALL integrations
// Corsair automatically routes to the right plugin
app.post('/webhooks', async (req, res) => {
	const rawBody = (req as any).rawBody;
  	// console.log(req.body);
	console.log(rawBody);
	// Extract tenant ID from query params (optional)
	const tenantId = req.query.tenantId as string | undefined;
	// Process the webhook - one function handles everything!
	// The list of plugins in createCorsair will subscribe to these webhooks
	const result = await processWebhook(corsair, req.headers, req.body, {
		tenantId,
	});
    // Acknowledge receipt of the webhook immediately
	// Return the response (or 200 OK if no response needed)
	if (result.response) {
		return res.json(result.response);
	}

    return res.status(200).send('OK'); 
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});