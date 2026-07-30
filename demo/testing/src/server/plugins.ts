import { agentql } from '@corsair-dev/agentql';
import { gmail } from '@corsair-dev/gmail';
import { googlecalendar } from '@corsair-dev/googlecalendar';
import { googlesheets } from '@corsair-dev/googlesheets';
import { hubspot } from '@corsair-dev/hubspot';
import { linear } from '@corsair-dev/linear';
import { onedrive } from '@corsair-dev/onedrive';
import { sharepoint } from '@corsair-dev/sharepoint';
import { slack } from '@corsair-dev/slack';
import { twilio } from '@corsair-dev/twilio';
import { vapi } from '@corsair-dev/vapi';

// The plugin set, built with no master kek and no database — safe to import in
// the isolated workflow child. A function so env vars resolve at call time
// (after dotenv), not at module load.
export function getPlugins() {
	return [
		// github({ authType: 'managed' }),
		slack({
			permissions: {
				mode: 'cautious',
				overrides: {
					'messages.post': 'require_approval',
				},
			},
		}),
		googlesheets(),
		googlecalendar(),
		gmail(),
		linear(),
		sharepoint(),
		onedrive(),
		hubspot(),
		agentql({
			key: process.env.AGENTQL_API_KEY,
		}),
		twilio(),
		vapi({
			key: process.env.VAPI_API_KEY,
			webhookSecret: process.env.VAPI_WEBHOOK_SECRET,
		}),
	];
}
