// main function exports

export { createCorsair } from './core';
export { processWebhook } from './webhooks';

// plugin function exports

export { github } from './plugins/github';
export { gmail } from './plugins/gmail';
export { googlecalendar } from './plugins/googlecalendar';
export { googledrive } from './plugins/googledrive';
export { googlesheets } from './plugins/googlesheets';
export { hubspot } from './plugins/hubspot';
export { linear } from './plugins/linear';
export { posthog } from './plugins/posthog';
export { resend } from './plugins/resend';
export { slack } from './plugins/slack';
export { spotify } from './plugins/spotify';
