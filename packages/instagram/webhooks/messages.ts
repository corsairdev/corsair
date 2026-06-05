import { logEventFromContext } from 'corsair/core';
import type { InstagramWebhooks } from '../index';
import { createInstagramWebhookMatcher, InstagramMessageReceivedEventSchema } from './types';


export const messageReceived: InstagramWebhooks['messageReceived'] = {
    match: createInstagramWebhookMatcher('messageReceived'),
    handler: async (ctx, request) => {
        const body = request.payload;

        const messaging = body.entry[0]?.messaging[0];

        if (!messaging) {
            console.error('Invalid webhook payload: missing messaging data');
            return { success: false, error: 'Invalid payload' };
        }

        if (
            !messaging?.message?.mid ||
            (!messaging.message.text &&
                !messaging.message.attachments)
        ) {
            return {
                success: true,
            };
        }

        const event = InstagramMessageReceivedEventSchema.parse({
            type: 'messageReceived',
            accountId: body?.entry[0]?.id,
            senderId: messaging.sender.id,
            recipientId: messaging.recipient.id,
            messageId: messaging.message?.mid,
            text: messaging.message?.text,
            timestamp: body?.entry[0]?.time,
            isEcho: messaging.message?.is_echo || false,
        });


        if (ctx.db.messages) {
            const result = await ctx.db.messages.upsertByEntityId(event.messageId, {
                senderId: event.senderId,
                recipient: event.recipientId,
                message: event.text,
                messageId: event.messageId,
            });

            console.log('Upserted message to database:', result);
        }

        await logEventFromContext(
            ctx,
            'instagram.webhook.messageReceived',
            { ...event },
            'completed'
        );
    

        return {
        success: true,
        event,
    }

}
}