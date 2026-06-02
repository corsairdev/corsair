import TeamsCommand from './subscribe/teams.command'

export default class TeamsSubscribeCommand extends TeamsCommand {
	getName(): string {
		return 'teams-subscribe';
	}

	getDescription(): string {
		return 'Subscribe Teams webhooks';
	}
}
