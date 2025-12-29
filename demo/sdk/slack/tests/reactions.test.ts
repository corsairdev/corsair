import { Slack } from '../api';
import { ReactionsService } from '../services';
import { requireToken, getTestChannel, handleRateLimit, generateTestId, sleep } from './setup';

describe('Slack.Reactions - Reactions API', () => {
    const testChannel = getTestChannel();
    let testMessageTs: string | undefined;

    beforeAll(async () => {
        if (!requireToken()) {
            try {
                const response = await Slack.Messages.send({
                    channel: testChannel,
                    text: `Reaction test message - ${generateTestId()}`,
                });
                testMessageTs = response.ts;
                console.log('Created test message for reactions:', testMessageTs);
            } catch (e) {
                console.warn('Could not create test message for reactions');
            }
        }
    });

    afterAll(async () => {
        if (testMessageTs && testChannel) {
            try {
                await Slack.Messages.delete({
                    channel: testChannel,
                    ts: testMessageTs,
                });
                console.log(`Cleanup: Deleted test message ${testMessageTs}`);
            } catch (e) {
                console.warn(`Cleanup failed for message ${testMessageTs}`);
            }
        }
    });

    describe('Service class methods', () => {
        it('should have all reaction methods defined', () => {
            expect(typeof ReactionsService.reactionsAdd).toBe('function');
            expect(typeof ReactionsService.reactionsGet).toBe('function');
            expect(typeof ReactionsService.reactionsRemove).toBe('function');
        });
    });

    describe('API facade methods', () => {
        it('should expose all reaction methods through facade', () => {
            expect(typeof Slack.Reactions.add).toBe('function');
            expect(typeof Slack.Reactions.get).toBe('function');
            expect(typeof Slack.Reactions.remove).toBe('function');
        });
    });

    describe('add', () => {
        it('should add a reaction (integration test)', async () => {
            if (requireToken()) return;
            if (!testMessageTs) {
                console.warn('No test message available');
                return;
            }

            try {
                const response = await Slack.Reactions.add({
                    channel: testChannel,
                    timestamp: testMessageTs,
                    name: 'thumbsup',
                });

                expect(response).toBeDefined();
                expect(response.ok).toBe(true);

                console.log('Added reaction: thumbsup');
            } catch (error: any) {
                if (error?.body?.error === 'already_reacted') {
                    console.log('Already reacted - skipping');
                    return;
                }
                await handleRateLimit(error);
            }
        });

        it('should add multiple reactions (integration test)', async () => {
            if (requireToken()) return;
            if (!testMessageTs) {
                console.warn('No test message available');
                return;
            }

            const reactions = ['heart', 'star', 'rocket'];
            
            for (const reaction of reactions) {
                try {
                    await sleep(500);
                    await Slack.Reactions.add({
                        channel: testChannel,
                        timestamp: testMessageTs,
                        name: reaction,
                    });
                    console.log(`Added reaction: ${reaction}`);
                } catch (error: any) {
                    if (error?.body?.error === 'already_reacted') {
                        console.log(`Already reacted with ${reaction}`);
                        continue;
                    }
                    throw error;
                }
            }
        });
    });

    describe('get', () => {
        it('should get reactions for a message (integration test)', async () => {
            if (requireToken()) return;
            if (!testMessageTs) {
                console.warn('No test message available');
                return;
            }

            try {
                const response = await Slack.Reactions.get({
                    channel: testChannel,
                    timestamp: testMessageTs,
                    full: true,
                });

                expect(response).toBeDefined();
                expect(response.ok).toBe(true);
                expect(response.message).toBeDefined();

                console.log('Message reactions:');
                response.message?.reactions?.forEach(reaction => {
                    console.log(`  :${reaction.name}: - ${reaction.count} users`);
                });
            } catch (error) {
                await handleRateLimit(error);
            }
        });
    });

    describe('remove', () => {
        it('should remove a reaction (integration test)', async () => {
            if (requireToken()) return;
            if (!testMessageTs) {
                console.warn('No test message available');
                return;
            }

            try {
                await sleep(1000);
                const response = await Slack.Reactions.remove({
                    channel: testChannel,
                    timestamp: testMessageTs,
                    name: 'thumbsup',
                });

                expect(response).toBeDefined();
                expect(response.ok).toBe(true);

                console.log('Removed reaction: thumbsup');
            } catch (error: any) {
                if (error?.body?.error === 'no_reaction') {
                    console.log('No reaction to remove - skipping');
                    return;
                }
                await handleRateLimit(error);
            }
        });
    });
});

