import { created as channelCreated } from './channels';
import {
	created as fileCreated,
	shared as fileShared,
	publicFile,
} from './files';
import { message } from './messages';
import { added as reactionAdded } from './reactions';
import { teamJoin, userChange } from './users';
import { challenge } from './challenge';

export const ChannelWebhooks = {
	created: channelCreated,
};

export const FileWebhooks = {
	created: fileCreated,
	public: publicFile,
	shared: fileShared,
};

export const MessageWebhooks = {
	message,
};

export const ReactionWebhooks = {
	added: reactionAdded,
};

export const UserWebhooks = {
	teamJoin,
	userChange,
};

export const ChallengeWebhooks = {
	challenge,
};

export * as usersWebhooks from './users';
