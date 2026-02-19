/**
 * Base webhook payload interface
 * 
 * CONFIGURATION:
 * Update this to match your provider's webhook payload structure.
 * Most providers include a 'type' field and 'data' field, but the structure may vary.
 */
export interface DiscordWebhookPayload {
	type: string;
	created_at: string;
	data: {
		[key: string]: any;
	};
	// TODO: Add provider-specific fields if needed
	// Example:
	// id: string;
	// timestamp: number;
}

/**
 * Webhook Event Types
 * 
 * CONFIGURATION:
 * - Replace ExampleEvent with your actual webhook event types
 * - Each event type should extend DiscordWebhookPayload
 * - Add all event-specific fields in the data object
 * 
 * Example:
 * export interface UserCreatedEvent extends DiscordWebhookPayload {
 *   type: 'user.created';
 *   data: {
 *     user_id: string;
 *     email: string;
 *     name: string;
 *   };
 * }
 */
export interface ExampleEvent extends DiscordWebhookPayload {
	type: 'example';
	data: {
		id: string;
		// TODO: Add your event data fields here
		[key: string]: any;
	};
}

/**
 * Webhook Outputs Type
 * 
 * Maps each webhook key to its event type.
 * This is used by the plugin system for type inference.
 * 
 * CONFIGURATION:
 * - Replace 'example' with your actual webhook keys
 * - Add all your webhooks here
 * - Each key should match a webhook in your webhooks/ directory
 */
export type DiscordWebhookOutputs = {
	example: ExampleEvent;
	// TODO: Add more webhooks as you implement them
};

/**
 * Creates a matcher function for a specific event type
 * 
 * CONFIGURATION:
 * This function is used to match incoming webhooks to the correct handler.
 * Most providers use a 'type' field, but you may need to customize this.
 */
export function createDiscordMatch(eventType: string) {
	return (payload: DiscordWebhookPayload) => {
		return payload.type === eventType;
	};
}

/**
 * Webhook Signature Verification
 * 
 * WEBHOOK CONFIGURATION:
 * Implement signature verification based on your provider's method.
 * 
 * Common verification methods:
 * - HMAC SHA256 (most common)
 * - HMAC SHA1
 * - Custom signature algorithms
 * 
 * Example for HMAC SHA256:
 * import crypto from 'crypto';
 * export function verifyDiscordWebhookSignature(
 *   request: { payload: DiscordWebhookPayload; headers: Record<string, string> },
 *   secret: string,
 * ): { valid: boolean; error?: string } {
 *   const signature = request.headers['x-discord-signature'];
 *   if (!signature) {
 *     return { valid: false, error: 'Missing signature' };
 *   }
 *   
 *   const payload = JSON.stringify(request.payload);
 *   const expectedSignature = crypto
 *     .createHmac('sha256', secret)
 *     .update(payload)
 *     .digest('hex');
 *   
 *   const isValid = crypto.timingSafeEqual(
 *     Buffer.from(signature),
 *     Buffer.from(expectedSignature)
 *   );
 *   
 *   return { valid: isValid, error: isValid ? undefined : 'Invalid signature' };
 * }
 */
export function verifyDiscordWebhookSignature(
	request: { payload: DiscordWebhookPayload; headers: Record<string, string> },
	secret: string,
): { valid: boolean; error?: string } {
	// TODO: Implement webhook signature verification
	// This is a placeholder - implement based on your provider's webhook verification method
	return { valid: true };
}
