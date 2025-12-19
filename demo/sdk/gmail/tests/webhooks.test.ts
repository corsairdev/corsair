import { Gmail } from '../api';
import { createWebhookHandler } from '../webhook-handler';
import { requireToken, getTestUserId, handleRateLimit } from './setup';

describe('Gmail Webhooks - Watch API and Push Notifications', () => {
    const userId = getTestUserId();
    let watchExpiration: string | undefined;

    afterAll(async () => {
        if (watchExpiration) {
            try {
                await Gmail.Users.stop(userId);
                console.log('Cleanup: Stopped watch');
            } catch (e) {
                console.warn('Cleanup: Could not stop watch');
            }
        }
    });

    describe('Users.getProfile', () => {
        it('should get user profile', async () => {
            if (requireToken()) return;

            try {
                const profile = await Gmail.Users.getProfile(userId);

                expect(profile).toBeDefined();
                expect(profile.emailAddress).toBeDefined();
                expect(profile.historyId).toBeDefined();

                console.log('Email:', profile.emailAddress);
                console.log('Messages total:', profile.messagesTotal);
                console.log('Threads total:', profile.threadsTotal);
                console.log('History ID:', profile.historyId);
            } catch (error) {
                await handleRateLimit(error);
            }
        });
    });

    describe('Users.watch', () => {
        it('should start watching mailbox', async () => {
            if (requireToken()) return;

            const topicName = process.env.GMAIL_WEBHOOK_TOPIC;
            if (!topicName) {
                console.log('Skipping watch test - GMAIL_WEBHOOK_TOPIC not set');
                return;
            }

            try {
                const watchResponse = await Gmail.Users.watch(userId, {
                    topicName,
                    labelIds: ['INBOX'],
                });

                expect(watchResponse).toBeDefined();
                expect(watchResponse.historyId).toBeDefined();
                expect(watchResponse.expiration).toBeDefined();

                watchExpiration = watchResponse.expiration;

                console.log('Watch started');
                console.log('History ID:', watchResponse.historyId);
                console.log('Expiration:', new Date(parseInt(watchResponse.expiration!)).toISOString());
            } catch (error: any) {
                if (error?.body?.error?.message?.includes('Pub/Sub')) {
                    console.log('Skipping - Pub/Sub not configured properly');
                } else {
                    await handleRateLimit(error);
                }
            }
        });
    });

    describe('Users.stop', () => {
        it('should stop watching mailbox', async () => {
            if (requireToken()) return;

            if (!watchExpiration) {
                console.log('Skipping stop test - watch not started');
                return;
            }

            try {
                await Gmail.Users.stop(userId);
                console.log('Watch stopped');
                watchExpiration = undefined;
            } catch (error) {
                await handleRateLimit(error);
            }
        });
    });

    describe('GmailWebhookHandler', () => {
        it('should create webhook handler', () => {
            const handler = createWebhookHandler({
                userId,
                autoFetchHistory: false,
            });

            expect(handler).toBeDefined();
        });

        it('should register event handlers', () => {
            const handler = createWebhookHandler();

            const historyHandler = jest.fn();
            const messageHandler = jest.fn();

            handler.on('history', historyHandler);
            handler.on('messageReceived', messageHandler);

            expect(historyHandler).not.toHaveBeenCalled();
            expect(messageHandler).not.toHaveBeenCalled();
        });

        it('should handle PubSub notification', async () => {
            const handler = createWebhookHandler({
                userId,
                autoFetchHistory: false,
            });

            const historyHandler = jest.fn();
            handler.on('history', historyHandler);

            const mockNotification = {
                message: {
                    data: Buffer.from(JSON.stringify({
                        emailAddress: 'test@example.com',
                        historyId: '12345',
                    })).toString('base64'),
                    messageId: 'msg-123',
                    publishTime: new Date().toISOString(),
                },
                subscription: 'projects/test/subscriptions/gmail-push',
            };

            const result = await handler.handlePubSubNotification(mockNotification);

            expect(result.success).toBe(true);
            expect(result.historyId).toBe('12345');
            expect(historyHandler).toHaveBeenCalled();
        });

        it('should track history ID', () => {
            const handler = createWebhookHandler();

            expect(handler.getLastHistoryId()).toBeUndefined();

            handler.setLastHistoryId('12345');
            expect(handler.getLastHistoryId()).toBe('12345');
        });
    });

    describe('History.list', () => {
        it('should list history changes', async () => {
            if (requireToken()) return;

            try {
                const profile = await Gmail.Users.getProfile(userId);
                const currentHistoryId = profile.historyId!;

                const historyId = (parseInt(currentHistoryId) - 100).toString();

                const historyResponse = await Gmail.History.list(
                    userId,
                    historyId,
                    10
                );

                expect(historyResponse).toBeDefined();

                if (historyResponse.history && historyResponse.history.length > 0) {
                    console.log(`Found ${historyResponse.history.length} history items`);
                    
                    const firstHistory = historyResponse.history[0];
                    if (firstHistory.messagesAdded) {
                        console.log('Messages added:', firstHistory.messagesAdded.length);
                    }
                    if (firstHistory.messagesDeleted) {
                        console.log('Messages deleted:', firstHistory.messagesDeleted.length);
                    }
                    if (firstHistory.labelsAdded) {
                        console.log('Labels added:', firstHistory.labelsAdded.length);
                    }
                    if (firstHistory.labelsRemoved) {
                        console.log('Labels removed:', firstHistory.labelsRemoved.length);
                    }
                } else {
                    console.log('No history changes found');
                }
            } catch (error: any) {
                if (error?.status === 404) {
                    console.log('History not found - startHistoryId may be too old');
                } else {
                    await handleRateLimit(error);
                }
            }
        });
    });
});

