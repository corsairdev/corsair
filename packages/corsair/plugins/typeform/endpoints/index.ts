import * as formsModule from './forms';
import * as imagesModule from './images';
import * as meModule from './me';
import * as responsesModule from './responses';
import * as themesModule from './themes';
import * as videosModule from './videos';
import * as webhooksConfigModule from './webhooks-config';
import * as workspacesModule from './workspaces';

export const Me = {
	get: meModule.get,
};

export const Forms = {
	list: formsModule.list,
	get: formsModule.get,
	create: formsModule.create,
	update: formsModule.update,
	patch: formsModule.patch,
	delete: formsModule.deleteForm,
	getMessages: formsModule.getMessages,
	updateMessages: formsModule.updateMessages,
};

export const Responses = {
	list: responsesModule.list,
	delete: responsesModule.deleteResponses,
	getAllFiles: responsesModule.getAllFiles,
};

export const Workspaces = {
	list: workspacesModule.list,
	get: workspacesModule.get,
	create: workspacesModule.create,
	createForAccount: workspacesModule.createForAccount,
	update: workspacesModule.update,
	delete: workspacesModule.deleteWorkspace,
};

export const Images = {
	list: imagesModule.list,
	create: imagesModule.create,
	delete: imagesModule.deleteImage,
	getBySize: imagesModule.getBySize,
	getBackgroundBySize: imagesModule.getBackgroundBySize,
	getChoiceImageBySize: imagesModule.getChoiceImageBySize,
};

export const Themes = {
	list: themesModule.list,
	get: themesModule.get,
	create: themesModule.create,
	update: themesModule.update,
	patch: themesModule.patch,
	delete: themesModule.deleteTheme,
};

export const WebhooksConfig = {
	list: webhooksConfigModule.list,
	get: webhooksConfigModule.get,
	createOrUpdate: webhooksConfigModule.createOrUpdate,
	delete: webhooksConfigModule.deleteWebhookConfig,
};

export const Videos = {
	upload: videosModule.upload,
};

export * from './types';
