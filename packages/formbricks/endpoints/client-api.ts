import { logEventFromContext } from 'corsair/core';
import type { FormbricksEndpoints } from '../index';
import { auditPayload, keyNamesOf } from './logging';
import { compactBody, formbricksCall } from './shared';
import type { FormbricksEndpointOutputs } from './types';

/**
 * The client API - the surface a survey widget uses in a respondent's browser.
 *
 * Two things distinguish it from the management API:
 *
 * - It is **workspace-scoped in the path**, `client/{workspaceId}/...`, rather than taking the id in
 *   a body.
 * - It is the side that handles **respondents**, not the account. Everything here either identifies
 *   a person or records that a survey was shown to one, so nothing is mirrored and nothing but ids
 *   and key names is logged.
 *
 * Formbricks documents this surface as requiring no authentication - a widget runs in a browser and
 * cannot hold a secret. The API key is still sent, because a plugin call is server-side and there is
 * no reason to drop it.
 */

/**
 * Records that a survey was displayed to someone.
 *
 * Not mirrored: displays are per-impression records, a firehose whose value is in aggregate.
 *
 * **Response shape observed**: `{id, contactId, surveyId}`, and no timestamps. Reaching it took one
 * step the first attempt missed - the survey must be set to `inProgress`, because a `draft` survey
 * answers `403 "Survey is not accepting submissions"`. That 403 reads like a permissions problem,
 * which is why the earlier conclusion here was that respondent data could not be produced at all.
 *
 * **The link parameter is `userId`, not `contactId`.** This function used to send `contactId`, which
 * Formbricks accepts with a 200 and ignores: the display is stored with `contactId: null` and the
 * caller is told nothing. Sending `userId` links it, and the resolved `contactId` comes back on the
 * response - so the audit records what the provider actually did rather than what was asked for.
 *
 * A `userId` that does not exist yet causes Formbricks to create the contact, so this operation can
 * add a person as a side effect of recording an impression.
 *
 * Non-idempotent: a replay records a second impression and inflates the survey's display count.
 */
export const createDisplay: FormbricksEndpoints['clientCreateDisplay'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['clientCreateDisplay']
	>(ctx, 'v1', `client/${input.workspaceId}/displays`, {
		method: 'POST',
		body: compactBody({
			surveyId: input.surveyId,
			userId: input.userId,
		}),
	});

	await logEventFromContext(
		ctx,
		'formbricks.client.createDisplay',
		{
			...auditPayload(input, ['workspaceId', 'surveyId']),
			// Whether a person was identified is worth auditing; which person is not. Read from the
			// response rather than the input, so an ignored link parameter could not report success.
			contact_identified:
				typeof result.contactId === 'string' && result.contactId.length > 0,
		},
		'completed',
	);
	return result;
};

/**
 * Creates a client user - the **v1** route.
 *
 * The catalog lists two operations for this, `CREATE_CLIENT_USER` and `CREATE_OR_IDENTIFY_USER`, and
 * both v1 and v2 expose a client user route. So the two ids are split across the versions rather
 * than one being treated as a duplicate: this is v1, {@link identifyUser} is v2.
 *
 * `attributes` carries whatever the workspace collects about the person - email and name by default
 * - so the audit records which attribute keys were set and never the values.
 */
export const createUser: FormbricksEndpoints['clientCreateUser'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['clientCreateUser']
	>(ctx, 'v1', `client/${input.workspaceId}/user`, {
		method: 'POST',
		body: compactBody({ userId: input.userId, attributes: input.attributes }),
	});

	await logEventFromContext(
		ctx,
		'formbricks.client.createUser',
		{
			...auditPayload(input, ['workspaceId']),
			// `userId` is the caller's own identifier for a person, so it is not recorded.
			attribute_keys: keyNamesOf(input.attributes),
		},
		'completed',
	);
	return result;
};

/**
 * Creates or identifies a client user - the **v2** route.
 *
 * The counterpart to {@link createUser}, and the reason both catalog ids can be honoured. "Create or
 * identify" is the more accurate description of what both routes do: calling with an existing
 * `userId` returns that person rather than failing, which is also why neither is a duplication risk
 * in the usual sense - though both remain in the non-idempotent set, because a caller cannot tell
 * from a failed response whether the person was created.
 */
export const identifyUser: FormbricksEndpoints['clientIdentifyUser'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['clientIdentifyUser']
	>(ctx, 'v2', `client/${input.workspaceId}/user`, {
		method: 'POST',
		body: compactBody({ userId: input.userId, attributes: input.attributes }),
	});

	await logEventFromContext(
		ctx,
		'formbricks.client.identifyUser',
		{
			...auditPayload(input, ['workspaceId']),
			attribute_keys: keyNamesOf(input.attributes),
		},
		'completed',
	);
	return result;
};

/**
 * Reads the client environment bundle - everything a widget needs to decide what to show.
 *
 * Two fields: `data` and `expiresAt`. **Not mirrored precisely because it carries its own expiry**;
 * caching a payload that declares when it goes stale is a way to serve stale data.
 *
 * The route is `client/{workspaceId}/environment` in **both** versions. This is the v1 one.
 */
export const environment: FormbricksEndpoints['clientEnvironment'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['clientEnvironment']
	>(ctx, 'v1', `client/${input.workspaceId}/environment`);

	await logEventFromContext(
		ctx,
		'formbricks.client.environment',
		auditPayload(input, ['workspaceId']),
		'completed',
	);
	return result;
};

/**
 * Reads one respondent's state - their segments, displays and response history.
 *
 * **This is a different payload from {@link environment}, and an earlier version of this function had
 * it wrong.** It read `client/{workspaceId}/environment` on v2 and described the catalog's two
 * client-read ids as one route serving two names. But the environment bundle is workspace-wide
 * configuration, while the catalog describes this operation as "the current state of a contact ...
 * their segment memberships, survey displays, and response history" - which is this:
 *
 * ```
 * { state: { data: { contactId, userId, segments, displays, responses, lastDisplayAt },
 *            expiresAt } }
 * ```
 *
 * **The only route that returns it is a POST.** `GET contacts/{userId}/state`,
 * `GET user/{userId}/state` and `GET contacts/state` are all 404s on both versions, so reading a
 * respondent's state means posting their `userId` to `client/{workspaceId}/user` - which **upserts**:
 * an unknown `userId` is created rather than reported missing. A caller using this to check whether
 * someone exists would create them by asking.
 *
 * That shared route is why this and {@link identifyUser} return the same shape. The distinction the
 * catalog draws is one of intent, not of endpoint, and stating that is better than inventing a
 * difference the API does not have.
 *
 * Everything in `state.data` belongs to one identified person, so none of it is logged - only the
 * workspace, and that a lookup happened.
 */
export const contactsState: FormbricksEndpoints['clientContactsState'] = async (
	ctx,
	input,
) => {
	const result = await formbricksCall<
		FormbricksEndpointOutputs['clientContactsState']
	>(ctx, 'v2', `client/${input.workspaceId}/user`, {
		method: 'POST',
		body: compactBody({ userId: input.userId }),
	});

	await logEventFromContext(
		ctx,
		'formbricks.client.contactsState',
		// `userId` is the caller's identifier for a person - deliberately not logged.
		auditPayload(input, ['workspaceId']),
		'completed',
	);
	return result;
};
