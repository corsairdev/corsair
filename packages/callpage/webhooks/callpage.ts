import { logEventFromContext } from 'corsair/core';
import type { CallPageWebhooks } from '../index';

export const event: CallPageWebhooks['event'] = {
  match: (body) => {
    if (typeof body !== 'object' || body === null || !('data' in body)) return false;
    const data = (body as { data?: unknown }).data;
    return typeof data === 'object' && data !== null && 'event' in data && typeof (data as { event?: unknown }).event === 'string';
  },
  handler: async (ctx, request) => {
    const payload = request.payload;
    const eventName = typeof payload === 'object' && payload !== null && 'data' in payload && typeof (payload as { data?: { event?: unknown } }).data?.event === 'string'
      ? (payload as { data: { event: string } }).data.event
      : 'unknown';
    await logEventFromContext(ctx, `callpage.webhook.${eventName}`, { event: eventName }, 'completed');
    return { success: true, data: payload };
  },
};
