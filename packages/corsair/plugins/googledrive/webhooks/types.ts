import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
} from '../../../core/webhooks';
import type { Change, File } from '../types';

export type PubSubMessage = {
	data?: string;
	attributes?: Record<string, string>;
	messageId?: string;
	publishTime?: string;
};

export type PubSubNotification<TEvent = unknown> = {
	message?: PubSubMessage;
	subscription?: string;
	event?: TEvent;
};

export type GoogleDrivePushNotification = {
	kind?: string;
	id?: string;
	resourceId?: string;
	resourceUri?: string;
	resourceState?: string;
	changed?: string;
	expiration?: string;
};

export type FileChangedEvent = {
	type: 'fileChanged';
	fileId: string;
	changeType: 'created' | 'updated' | 'deleted' | 'trashed' | 'untrashed';
	file?: File;
	filePath?: string;
	change?: Change;
	allFiles: Array<{ file: File; filePath: string; change: Change; changeType: 'created' | 'updated' | 'deleted' | 'trashed' | 'untrashed' }>;
	allFolders: Array<{ folder: File; filePath: string; change: Change; changeType: 'created' | 'updated' | 'deleted' | 'trashed' | 'untrashed' }>;
};

export type FolderChangedEvent = {
	type: 'folderChanged';
	folderId: string;
	changeType: 'created' | 'updated' | 'deleted' | 'trashed' | 'untrashed';
	folder?: File;
	filePath?: string;
	change?: Change;
	allFiles: Array<{ file: File; filePath: string; change: Change; changeType: 'created' | 'updated' | 'deleted' | 'trashed' | 'untrashed' }>;
	allFolders: Array<{ folder: File; filePath: string; change: Change; changeType: 'created' | 'updated' | 'deleted' | 'trashed' | 'untrashed' }>;
};

export type GoogleDriveWebhookEvent = FileChangedEvent | FolderChangedEvent;

export type GoogleDriveEventName = 'driveChanged';

export interface GoogleDriveEventMap {
	driveChanged: FileChangedEvent | FolderChangedEvent;
}

export type GoogleDriveWebhookPayload<TEvent = unknown> = PubSubNotification<TEvent>;

export type GoogleDriveWebhookOutputs = {
	driveChanged: FileChangedEvent | FolderChangedEvent;
};

export function decodePubSubMessage(data: string): GoogleDrivePushNotification {
	const decodedData = Buffer.from(data, 'base64').toString('utf-8');
	return JSON.parse(decodedData);
}

export function createGoogleDriveWebhookMatcher(
	eventType: GoogleDriveEventName,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const body = request.body as PubSubNotification;
		if (!body.message?.data) {
			return false;
		}

		try {
			const pushNotification = decodePubSubMessage(body.message.data!);
			return !!pushNotification.resourceId && !!pushNotification.resourceUri;
		} catch {
			return false;
		}
	};
}
