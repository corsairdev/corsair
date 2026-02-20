import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
	const tenant = corsair.withTenant('default');
	const CHAT_ID = '-1003750192801';
	await tenant.telegram.api.messages.sendMessage({
		chat_id: CHAT_ID,
		text: 'Hello, world!',
	});
	// const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
	
	// await tenant.telegram.keys.set_bot_token(BOT_TOKEN);

	// Delete webhook to allow getUpdates
	// console.log('Deleting webhook...');
	// const deleteResult = await tenant.telegram.api.webhook.deleteWebhook({
	// 	drop_pending_updates: false, // Set to true if you want to drop pending updates
	// } as { drop_pending_updates?: boolean });
	// console.log('Webhook deleted:', deleteResult);

	// Get bot info
	// const botInfo = await tenant.telegram.api.me.getMe({});
	// console.log('Bot Info:', botInfo);
	// console.log('Bot Username:', botInfo.username);

	// Get recent updates (messages)
	// console.log('\nFetching updates...');
	// const updates = await tenant.telegram.api.updates.getUpdates({
	// 	limit: 10,
	// });
	
	// console.log('Recent Updates:', updates);
	// console.log(`Found ${updates.length} update(s)\n`);
	
	// // Extract chat IDs from updates
	// updates.forEach((update, index) => {
	// 	if (update.message) {
	// 		console.log(`Update ${index + 1}:`);
	// 		console.log('  Chat ID:', update.message.chat.id);
	// 		console.log('  Chat Type:', update.message.chat.type);
	// 		console.log('  Chat Title/Username:', update.message.chat.title || update.message.chat.username);
	// 		console.log('  Message Text:', update.message.text);
	// 		console.log('  From:', update.message.from?.first_name, update.message.from?.username);
	// 		console.log('---');
	// 	}
	// });
};

main();