import * as dotenv from 'dotenv';
import { Gmail } from './api';
import { OpenAPI } from './core/OpenAPI';

dotenv.config();

function createTestEmail(to: string, subject: string, body: string): string {
    const email = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset=utf-8',
        '',
        body,
    ].join('\n');

    return Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function triggerEvents() {
    OpenAPI.TOKEN = process.env.GMAIL_ACCESS_TOKEN;
    const userId = process.env.GMAIL_USER_ID || 'me';
    const testEmail = process.env.TEST_EMAIL || 'mukulydv15@gmail.com';

    console.log('\n🎯 Triggering Gmail Events...\n');

    try {
        console.log('1️⃣  Sending test email...');
        const raw = createTestEmail(
            testEmail,
            `Test Email - ${new Date().toLocaleTimeString()}`,
            `This is a test email to trigger webhook events!\n\nSent at: ${new Date().toISOString()}`
        );
        
        const sentMessage = await Gmail.Messages.send(userId, { raw });
        console.log(`   ✅ Sent message: ${sentMessage.id}`);
        await sleep(2000);

        console.log('\n2️⃣  Getting inbox messages...');
        const messages = await Gmail.Messages.list(userId, 'is:inbox', 5);
        if (messages.messages && messages.messages.length > 0) {
            const messageId = messages.messages[0].id!;
            console.log(`   Found message: ${messageId}`);

            console.log('\n3️⃣  Adding STARRED label...');
            await Gmail.Messages.modify(userId, messageId, {
                addLabelIds: ['STARRED'],
            });
            console.log('   ✅ Added STARRED label');
            await sleep(2000);

            console.log('\n4️⃣  Removing STARRED label...');
            await Gmail.Messages.modify(userId, messageId, {
                removeLabelIds: ['STARRED'],
            });
            console.log('   ✅ Removed STARRED label');
            await sleep(2000);

            console.log('\n5️⃣  Marking as read...');
            await Gmail.Messages.modify(userId, messageId, {
                removeLabelIds: ['UNREAD'],
            });
            console.log('   ✅ Marked as read');
            await sleep(2000);

            console.log('\n6️⃣  Marking as unread...');
            await Gmail.Messages.modify(userId, messageId, {
                addLabelIds: ['UNREAD'],
            });
            console.log('   ✅ Marked as unread');
        }

        if (sentMessage.id) {
            console.log('\n7️⃣  Cleaning up test message...');
            await Gmail.Messages.delete(userId, sentMessage.id);
            console.log('   ✅ Deleted test message');
        }

        console.log('\n🎉 All events triggered!');
        console.log('\n📋 Check your webhook server logs for captured events');
        console.log('📁 Check tests/fixtures/ for saved fixture files\n');

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        if (error.body) {
            console.error('Details:', JSON.stringify(error.body, null, 2));
        }
    }
}

triggerEvents();

