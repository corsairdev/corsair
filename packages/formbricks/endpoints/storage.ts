import { logEventFromContext } from 'corsair/core';
import type { FormbricksEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactBody, formbricksCall } from './shared';
import type { FormbricksEndpointOutputs } from './types';

/**
 * File storage - uploads for survey assets and respondent file answers.
 *
 * **Both operations are the same route.** `POST v1/management/storage` takes an
 * `accessType: 'public' | 'private'` and answers an S3 **presigned POST** grant:
 *
 * ```
 * { signedUrl, presignedFields, fileUrl }
 * ```
 *
 * Two things an earlier version of this file had wrong. It sent the private upload to
 * `v1/client/{workspaceId}/storage`, reasoning that a respondent-facing upload belonged with the rest
 * of the client API - that route answers `400 "Fields are missing or incorrectly formatted"` to every
 * body tried, so the operation could not succeed. And it described the exchange as a signed **PUT**,
 * where it is a presigned POST with form fields; a caller following that description would have
 * uploaded nothing.
 *
 * **`presignedFields` and `signedUrl` are credentials.** The fields include `X-Amz-Signature`,
 * `X-Amz-Credential`, `X-Amz-Security-Token` and `Policy` - a short-lived grant to write into the
 * bucket under this workspace. They are returned to the caller, who cannot upload without them, and
 * are **never logged and never mirrored**, the same treatment as a webhook signing secret.
 *
 * The upload itself is the caller's step: POST `multipart/form-data` to `signedUrl` with every
 * `presignedFields` entry as a form field and the file last. This plugin obtains the grant and stops
 * there, which is also why the 5MB ceiling the catalog documents is not enforced here - S3 enforces
 * it when the bytes arrive, and this operation never sees them.
 *
 * The privacy split matters here as much as anywhere: a **private** upload is a file a survey
 * respondent attached to an answer, so the filename alone can be identifying. Neither operation logs
 * a filename.
 */

/**
 * Requests an upload grant for a **public** file - a survey's logo or background image.
 *
 * Public means served without authentication once uploaded, so nothing respondent-specific belongs
 * here. `accessType` is sent explicitly rather than relying on the default: omitting it happens to
 * produce a public grant today, and a default that flipped would silently publish private files.
 */
export const uploadPublic: FormbricksEndpoints['storageUploadPublic'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['storageUploadPublic']
	>(ctx, 'v1', 'management/storage', {
		method: 'POST',
		body: compactBody({
			workspaceId: input.workspaceId,
			fileName: input.fileName,
			fileType: input.fileType,
			accessType: 'public',
		}),
	});

	await logEventFromContext(
		ctx,
		'formbricks.storage.uploadPublic',
		{
			// The workspace and the declared media type, never the filename - a filename is
			// caller-authored text and can carry anything.
			...auditPayload(input, ['workspaceId', 'fileType']),
		},
		'completed',
	);
	return result;
};

/**
 * Requests an upload grant for a **private** file - typically a file a respondent attached to an
 * answer.
 *
 * **Management-scoped, not client-scoped.** The client route this used to call is a 400 for every
 * body; `accessType: 'private'` on the management route is what produces a private grant.
 *
 * Private files are the more sensitive of the two by some distance: the content belongs to a survey
 * respondent, and so does the filename. Neither is logged, and `surveyId` is recorded only so an
 * operator can tell which survey received an upload.
 */
export const uploadPrivate: FormbricksEndpoints['storageUploadPrivate'] =
	async (ctx, input) => {
		const result = await formbricksCall<
			FormbricksEndpointOutputs['storageUploadPrivate']
		>(ctx, 'v1', 'management/storage', {
			method: 'POST',
			body: compactBody({
				workspaceId: input.workspaceId,
				fileName: input.fileName,
				fileType: input.fileType,
				surveyId: input.surveyId,
				accessType: 'private',
			}),
		});

		await logEventFromContext(
			ctx,
			'formbricks.storage.uploadPrivate',
			{
				...auditPayload(input, ['workspaceId', 'fileType', 'surveyId']),
			},
			'completed',
		);
		return result;
	};
