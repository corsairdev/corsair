import { Slack } from '../api';
import { ChannelsService } from '../services';
import { requireToken, getTestChannel, handleRateLimit, generateTestId, sleep } from './setup';

describe('Slack.Channels - Conversations API', () => {
    const testChannel = getTestChannel();
    let createdChannelId: string | undefined;

    afterAll(async () => {
        if (createdChannelId) {
            try {
                await Slack.Channels.archive({ channel: createdChannelId });
                console.log(`Cleanup: Archived channel ${createdChannelId}`);
            } catch (e) {
                console.warn(`Cleanup failed for channel ${createdChannelId}`);
            }
        }
    });

    describe('Service class methods', () => {
        it('should have all channel methods defined', () => {
            expect(typeof ChannelsService.conversationsArchive).toBe('function');
            expect(typeof ChannelsService.conversationsClose).toBe('function');
            expect(typeof ChannelsService.conversationsCreate).toBe('function');
            expect(typeof ChannelsService.conversationsInfo).toBe('function');
            expect(typeof ChannelsService.conversationsList).toBe('function');
            expect(typeof ChannelsService.conversationsHistory).toBe('function');
            expect(typeof ChannelsService.conversationsInvite).toBe('function');
            expect(typeof ChannelsService.conversationsJoin).toBe('function');
            expect(typeof ChannelsService.conversationsKick).toBe('function');
            expect(typeof ChannelsService.conversationsLeave).toBe('function');
            expect(typeof ChannelsService.conversationsMembers).toBe('function');
            expect(typeof ChannelsService.conversationsOpen).toBe('function');
            expect(typeof ChannelsService.conversationsRename).toBe('function');
            expect(typeof ChannelsService.conversationsReplies).toBe('function');
            expect(typeof ChannelsService.conversationsSetPurpose).toBe('function');
            expect(typeof ChannelsService.conversationsSetTopic).toBe('function');
            expect(typeof ChannelsService.conversationsUnarchive).toBe('function');
        });
    });

    describe('API facade methods', () => {
        it('should expose all channel methods through facade', () => {
            expect(typeof Slack.Channels.archive).toBe('function');
            expect(typeof Slack.Channels.close).toBe('function');
            expect(typeof Slack.Channels.create).toBe('function');
            expect(typeof Slack.Channels.get).toBe('function');
            expect(typeof Slack.Channels.list).toBe('function');
            expect(typeof Slack.Channels.getHistory).toBe('function');
            expect(typeof Slack.Channels.invite).toBe('function');
            expect(typeof Slack.Channels.join).toBe('function');
            expect(typeof Slack.Channels.kick).toBe('function');
            expect(typeof Slack.Channels.leave).toBe('function');
            expect(typeof Slack.Channels.getMembers).toBe('function');
            expect(typeof Slack.Channels.open).toBe('function');
            expect(typeof Slack.Channels.rename).toBe('function');
            expect(typeof Slack.Channels.getReplies).toBe('function');
            expect(typeof Slack.Channels.setPurpose).toBe('function');
            expect(typeof Slack.Channels.setTopic).toBe('function');
            expect(typeof Slack.Channels.unarchive).toBe('function');
        });
    });

    describe('list', () => {
        it('should list channels (integration test)', async () => {
            if (requireToken()) return;

            try {
                const response = await Slack.Channels.list({
                    limit: 10,
                    exclude_archived: true,
                });

                expect(response).toBeDefined();
                expect(response.ok).toBe(true);
                expect(Array.isArray(response.channels)).toBe(true);

                console.log('Channels count:', response.channels?.length);
                response.channels?.slice(0, 5).forEach(channel => {
                    console.log(`  #${channel.name} (${channel.id})`);
                });
            } catch (error) {
                await handleRateLimit(error);
            }
        });
    });

    describe('create', () => {
        it('should create a channel (integration test)', async () => {
            if (requireToken()) return;

            try {
                const channelName = `test-${generateTestId()}`.substring(0, 21);
                const response = await Slack.Channels.create({
                    name: channelName,
                    is_private: false,
                });

                expect(response).toBeDefined();
                expect(response.ok).toBe(true);
                expect(response.channel).toBeDefined();
                expect(response.channel?.name).toBe(channelName);

                createdChannelId = response.channel?.id;
                console.log('Created channel:', response.channel?.name);
                console.log('Channel ID:', response.channel?.id);
            } catch (error: any) {
                if (error?.body?.error === 'name_taken') {
                    console.log('Channel name already taken - skipping');
                    return;
                }
                await handleRateLimit(error);
            }
        });
    });

    describe('get', () => {
        it('should get channel info (integration test)', async () => {
            if (requireToken()) return;
            if (!createdChannelId && !testChannel) {
                console.warn('No channel available for testing');
                return;
            }

            try {
                const channelId = createdChannelId || testChannel;
                const response = await Slack.Channels.get({
                    channel: channelId,
                    include_num_members: true,
                });

                expect(response).toBeDefined();
                expect(response.ok).toBe(true);
                expect(response.channel).toBeDefined();
                expect(response.channel?.id).toBe(channelId);

                console.log('Channel name:', response.channel?.name);
                console.log('Members:', response.channel?.num_members);
            } catch (error) {
                await handleRateLimit(error);
            }
        });
    });

    describe('getHistory', () => {
        it('should get channel history (integration test)', async () => {
            if (requireToken()) return;
            if (!createdChannelId && !testChannel) {
                console.warn('No channel available for testing');
                return;
            }

            try {
                const channelId = createdChannelId || testChannel;
                const response = await Slack.Channels.getHistory({
                    channel: channelId,
                    limit: 10,
                });

                expect(response).toBeDefined();
                expect(response.ok).toBe(true);
                expect(Array.isArray(response.messages)).toBe(true);

                console.log('Messages count:', response.messages?.length);
                response.messages?.slice(0, 3).forEach(msg => {
                    console.log(`  [${msg.ts}] ${msg.text?.substring(0, 50)}...`);
                });
            } catch (error) {
                await handleRateLimit(error);
            }
        });
    });

    describe('getMembers', () => {
        it('should get channel members (integration test)', async () => {
            if (requireToken()) return;
            if (!createdChannelId && !testChannel) {
                console.warn('No channel available for testing');
                return;
            }

            try {
                const channelId = createdChannelId || testChannel;
                const response = await Slack.Channels.getMembers({
                    channel: channelId,
                    limit: 100,
                });

                expect(response).toBeDefined();
                expect(response.ok).toBe(true);
                expect(Array.isArray(response.members)).toBe(true);

                console.log('Members count:', response.members?.length);
                response.members?.slice(0, 5).forEach(memberId => {
                    console.log(`  User: ${memberId}`);
                });
            } catch (error) {
                await handleRateLimit(error);
            }
        });
    });

    describe('setPurpose and setTopic', () => {
        it('should set channel purpose (integration test)', async () => {
            if (requireToken()) return;
            if (!createdChannelId) {
                console.warn('No created channel available for testing');
                return;
            }

            try {
                await sleep(1000);
                const response = await Slack.Channels.setPurpose({
                    channel: createdChannelId,
                    purpose: 'Test channel purpose - automated test',
                });

                expect(response).toBeDefined();
                expect(response.ok).toBe(true);
                console.log('Purpose set:', response.purpose);
            } catch (error) {
                await handleRateLimit(error);
            }
        });

        it('should set channel topic (integration test)', async () => {
            if (requireToken()) return;
            if (!createdChannelId) {
                console.warn('No created channel available for testing');
                return;
            }

            try {
                await sleep(1000);
                const response = await Slack.Channels.setTopic({
                    channel: createdChannelId,
                    topic: 'Test channel topic - automated test',
                });

                expect(response).toBeDefined();
                expect(response.ok).toBe(true);
                console.log('Topic set:', response.topic);
            } catch (error) {
                await handleRateLimit(error);
            }
        });
    });
});

