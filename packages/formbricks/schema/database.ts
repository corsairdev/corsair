import { z } from 'zod';
import {
	B,
	Id,
	N,
	S,
	StrArray,
	Timestamp,
	U,
	UnknownArray,
} from './primitives';

/**
 * Locally persisted Formbricks entities.
 *
 * Formbricks splits into **configuration** and **collected data**, and only the first is
 * mirrored:
 *
 * - **Configuration** - surveys, action classes, webhooks, contact attribute keys, teams.
 *   Authored by the account, changes rarely, and is the lookup every other operation needs:
 *   a response references a `surveyId`, a contact attribute references an `attributeKeyId`.
 * - **Collected data** - responses, contacts, contact attributes, displays. These arrive
 *   continuously from real respondents and are the firehose. A local copy would be stale on
 *   arrival, and it would be a copy of other people's personal data.
 *
 * That second point is sharper here than on most providers. A Formbricks response is *survey
 * answers from an identifiable person*, and collecting them is the entire purpose of the
 * product rather than a side effect of it. See `schema/responses.ts` for the shapes that stay
 * remote and why.
 *
 * Every field below was observed on a live response from a Formbricks Cloud workspace on
 * 2026-08-15. Field names match the API's JSON keys exactly.
 *
 * Only the primary key is required - see `schema/primitives.ts`.
 *
 * @see https://formbricks.com/docs
 */

/**
 * Surveys. **46 live fields**, the widest entity in the API by a wide margin.
 *
 * Mirrored because it is the anchor: responses, displays and webhooks all reference a survey
 * id, and resolving one to a name is the lookup a local copy exists for.
 *
 * Most of the width is authored configuration - `questions`, `blocks`, `endings`, `styling`,
 * `languages` - and none of it is modelled. Those are edited in the Formbricks survey editor
 * and their shape depends on each question's `type`, so a closed schema would reject a valid
 * survey the moment someone used a question type this plugin had not enumerated. They are
 * carried through unmodelled rather than half-modelled.
 */
export const FormbricksSurveyEntity = z
	.object({
		id: Id,
		name: S,
		type: S,
		status: S,
		workspaceId: S,
		createdBy: S,
		slug: S,
		createdAt: Timestamp,
		updatedAt: Timestamp,
		publishOn: Timestamp,
		closeOn: Timestamp,
		archivedAt: Timestamp,

		// Authored survey content. Survey-defined shapes; see the note above.
		welcomeCard: U,
		questions: UnknownArray,
		blocks: U,
		endings: UnknownArray,
		hiddenFields: U,
		variables: UnknownArray,
		styling: U,
		languages: UnknownArray,
		surveyClosedMessage: U,
		metadata: U,

		// Display and recontact behaviour.
		displayOption: S,
		recontactDays: N,
		displayLimit: N,
		displayPercentage: N,
		autoClose: N,
		delay: N,
		autoComplete: N,

		// Feature switches, all booleans on the wire.
		isVerifyEmailEnabled: B,
		isSingleResponsePerEmailEnabled: B,
		isBackButtonHidden: B,
		isAutoProgressingEnabled: B,
		isCaptureIpEnabled: B,
		showLanguageSwitch: B,

		redirectUrl: S,
		pin: S,
		singleUse: U,
		recaptcha: U,
		customHeadScripts: S,
		customHeadScriptsMode: S,
		workspaceOverwrites: U,
		projectOverwrites: U,
		triggers: UnknownArray,
		segment: U,
		followUps: UnknownArray,
	})
	.loose();
export type FormbricksSurveyEntity = z.infer<typeof FormbricksSurveyEntity>;

/**
 * Action classes - the events that can trigger a survey. 9 live fields.
 *
 * Mirrored: configuration, referenced by a survey's `triggers`, and small.
 *
 * `noCodeConfig` holds the selector or page-match rules for a no-code action, and its shape
 * depends on `type`. Carried unmodelled for the same reason as a survey's questions.
 */
export const FormbricksActionClassEntity = z
	.object({
		id: Id,
		name: S,
		description: S,
		type: S,
		key: S,
		workspaceId: S,
		noCodeConfig: U,
		createdAt: Timestamp,
		updatedAt: Timestamp,
	})
	.loose();
export type FormbricksActionClassEntity = z.infer<
	typeof FormbricksActionClassEntity
>;

/**
 * Webhooks. 10 fields on a create response, 9 on a list.
 *
 * **The extra field is `secret`, and it is a credential.** `POST v1/webhooks` returns it;
 * `GET v2/management/webhooks` does not. So a create hands back a signing secret that later
 * reads never show again.
 *
 * It is declared here because the schema has to accept it - a create response carrying an
 * undeclared field would still parse, but silently, and the point of declaring it is to make
 * the handling deliberate. It is **never logged**, and `endpoints/persist.ts` strips it before
 * the row is mirrored, so the secret does not reach durable local storage. A caller who needs
 * it must read it from the create's return value, which is the only place it exists.
 */
export const FormbricksWebhookEntity = z
	.object({
		id: Id,
		name: S,
		url: S,
		source: S,
		workspaceId: S,
		triggers: StrArray,
		surveyIds: StrArray,
		/**
		 * Present only on the create response. Stripped before mirroring and never logged -
		 * see `endpoints/persist.ts`.
		 */
		secret: S,
		createdAt: Timestamp,
		updatedAt: Timestamp,
	})
	.loose();
export type FormbricksWebhookEntity = z.infer<typeof FormbricksWebhookEntity>;

/**
 * Contact attribute keys - the *schema* of what can be known about a contact, not the values.
 * 10 live fields.
 *
 * Mirrored because it is configuration and it is the lookup that makes contact attributes
 * legible: an attribute row references `attributeKeyId`, and resolving that to `email` or
 * `userId` is exactly what a local copy is for.
 *
 * The five keys a new workspace starts with are `userId`, `email`, `firstName`, `lastName`
 * and `language`. Note what this entity does **not** hold: any attribute *value*. Those are
 * personal data and stay remote - see `FormbricksContactAttribute` in `schema/responses.ts`.
 */
export const FormbricksContactAttributeKeyEntity = z
	.object({
		id: Id,
		key: S,
		name: S,
		description: S,
		type: S,
		dataType: S,
		isUnique: B,
		workspaceId: S,
		createdAt: Timestamp,
		updatedAt: Timestamp,
	})
	.loose();
export type FormbricksContactAttributeKeyEntity = z.infer<
	typeof FormbricksContactAttributeKeyEntity
>;

/**
 * Teams. 5 live fields - a name and its organization.
 *
 * Observed by creating a team and deleting it, because the recon workspace had none.
 *
 * Note what is absent: there is no members array. A team record carries no membership at all,
 * so the mirror cannot answer "who is on this team" and must not appear to.
 */
export const FormbricksTeamEntity = z
	.object({
		id: Id,
		name: S,
		organizationId: S,
		createdAt: Timestamp,
		updatedAt: Timestamp,
	})
	.loose();
export type FormbricksTeamEntity = z.infer<typeof FormbricksTeamEntity>;
