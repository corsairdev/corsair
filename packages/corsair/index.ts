// main function exports

export { createCorsair } from './core';
export type { PermissionExecuteResult } from './permissions';
export { executePermission } from './permissions';
export { processWebhook } from './webhooks';

// plugin function exports

export { airtable } from './plugins/airtable';
export { amplitude } from './plugins/amplitude';
export { cal } from './plugins/cal';
export { discord } from './plugins/discord';
export { github } from './plugins/github';
export { gmail } from './plugins/gmail';
export { googlecalendar } from './plugins/googlecalendar';
export { googledrive } from './plugins/googledrive';
export { googlesheets } from './plugins/googlesheets';
export { hubspot } from './plugins/hubspot';
export { linear } from './plugins/linear';
export { notion } from './plugins/notion';
export { pagerduty } from './plugins/pagerduty';
export { posthog } from './plugins/posthog';
export { resend } from './plugins/resend';
export { sentry } from './plugins/sentry';
export { slack } from './plugins/slack';
export { spotify } from './plugins/spotify';
export { todoist } from './plugins/todoist';
export { monday } from './plugins/monday';
export { exa } from './plugins/exa';
export { oura } from './plugins/oura';
export { twitterapiio } from './plugins/twitterapiio';
export { dropbox } from './plugins/dropbox';

export { type SetupCorsairOptions, setupCorsair } from './setup/index';
