import * as AccountEndpoints from './account';
import * as ArchiveEndpoints from './archive';
import * as AutomationsEndpoints from './automations';
import * as ContactsEndpoints from './contacts';
import * as EmailsEndpoints from './emails';
import * as IntegrationsEndpoints from './integrations';
import * as ListsEndpoints from './lists';
import * as MediaEndpoints from './media';
import * as PollsEndpoints from './polls';
import * as ReportsEndpoints from './reports';
import * as SignupFormsEndpoints from './signup-forms';
import * as SurveysEndpoints from './surveys';
import * as WebhooksEndpoints from './webhooks';

export const Contacts = ContactsEndpoints;
export const Lists = ListsEndpoints;
export const Emails = EmailsEndpoints;
export const Archive = ArchiveEndpoints;
export const Automations = AutomationsEndpoints;
export const Reports = ReportsEndpoints;
export const SignupForms = SignupFormsEndpoints;
export const Surveys = SurveysEndpoints;
export const Polls = PollsEndpoints;
export const Media = MediaEndpoints;
export const Account = AccountEndpoints;
export const Integrations = IntegrationsEndpoints;
export const Webhooks = WebhooksEndpoints;

export * from './types';
