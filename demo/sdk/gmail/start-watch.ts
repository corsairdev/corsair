import * as dotenv from 'dotenv';
import { Gmail } from './api';
import { OpenAPI } from './core/OpenAPI';

dotenv.config();

async function startWatch() {
    OpenAPI.TOKEN = process.env.GMAIL_ACCESS_TOKEN;
    const userId = process.env.GMAIL_USER_ID || 'me';
    const topicName = process.env.GMAIL_WEBHOOK_TOPIC || 'projects/sdk-test-481704/topics/gmail-push';

    console.log('\n🚀 Starting Gmail Watch...\n');
    console.log(`User: ${userId}`);
    console.log(`Topic: ${topicName}\n`);

    try {
        const profile = await Gmail.Users.getProfile(userId);
        console.log('Current Profile:');
        console.log(`  Email: ${profile.emailAddress}`);
        console.log(`  History ID: ${profile.historyId}\n`);

        const watchResponse = await Gmail.Users.watch(userId, {
            topicName,
            labelIds: ['INBOX'],
        });

        console.log('✅ Watch Started Successfully!\n');
        console.log(`History ID: ${watchResponse.historyId}`);
        console.log(`Expiration: ${new Date(parseInt(watchResponse.expiration!)).toISOString()}`);
        console.log(`Expires in: ${Math.round((parseInt(watchResponse.expiration!) - Date.now()) / (1000 * 60 * 60 * 24))} days\n`);

        console.log('📬 Now trigger some events:\n');
        console.log('1. Send yourself an email');
        console.log('2. Star/unstar a message');
        console.log('3. Add/remove labels from messages');
        console.log('4. Mark messages as read/unread');
        console.log('5. Move messages to trash\n');
        console.log('Watch your webhook server terminal for events!\n');

    } catch (error: any) {
        console.error('❌ Error starting watch:', error.message);
        if (error.body) {
            console.error('Details:', JSON.stringify(error.body, null, 2));
        }
        process.exit(1);
    }
}

startWatch();

