# @corsair-dev/surveymonkey

SurveyMonkey plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/surveymonkey
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `collectors.create` | `surveymonkey.api.collectors.create` | `write` | Create a weblink or email collector for a survey, which is what gives it a public link |
| `collectors.delete` | `surveymonkey.api.collectors.delete` | `destructive` | Delete a collector. Its link stops working, and the responses it gathered stay |
| `collectors.get` | `surveymonkey.api.collectors.get` | `read` | Read one collector with its settings, link and status |
| `collectors.list` | `surveymonkey.api.collectors.list` | `read` | List the collectors of a survey with their links and status |
| `collectors.update` | `surveymonkey.api.collectors.update` | `write` | Change a collector settings, or open and close it by status |
| `contactLists.copy` | `surveymonkey.api.contactLists.copy` | `write` | Copy a contact list, optionally under a new name |
| `contactLists.create` | `surveymonkey.api.contactLists.create` | `write` | Create an empty contact list |
| `contactLists.delete` | `surveymonkey.api.contactLists.delete` | `destructive` | Delete a contact list. The contacts on it stay on the account |
| `contactLists.get` | `surveymonkey.api.contactLists.get` | `read` | Read one contact list |
| `contactLists.list` | `surveymonkey.api.contactLists.list` | `read` | List the contact lists on the account |
| `contactLists.merge` | `surveymonkey.api.contactLists.merge` | `destructive` | Move every contact from this list into another. The source list is left empty, so this effectively undoes it |
| `contactLists.update` | `surveymonkey.api.contactLists.update` | `write` | Rename a contact list |
| `contacts.bulkCreate` | `surveymonkey.api.contacts.bulkCreate` | `write` | Create up to a few hundred contacts in one call, optionally updating existing ones |
| `contacts.create` | `surveymonkey.api.contacts.create` | `write` | Create a contact with a name and an email or a phone number |
| `contacts.delete` | `surveymonkey.api.contacts.delete` | `destructive` | Delete a contact. It stops receiving invites and leaves every contact list |
| `contacts.get` | `surveymonkey.api.contacts.get` | `read` | Read one contact with its custom fields and status |
| `contacts.list` | `surveymonkey.api.contacts.list` | `read` | List contacts on the account, filtered by status or a search field |
| `contacts.listFields` | `surveymonkey.api.contacts.listFields` | `read` | List the custom contact fields and their labels |
| `contacts.update` | `surveymonkey.api.contacts.update` | `write` | Change a contact name, email, phone number or custom fields |
| `contacts.updateField` | `surveymonkey.api.contacts.updateField` | `write` | Rename a custom contact field |
| `folders.create` | `surveymonkey.api.folders.create` | `write` | Create a folder to group surveys in |
| `folders.list` | `surveymonkey.api.folders.list` | `read` | List the survey folders on the account |
| `messages.create` | `surveymonkey.api.messages.create` | `write` | Draft an invite or reminder for an email collector. Nothing is sent until send is called |
| `messages.get` | `surveymonkey.api.messages.get` | `read` | Read one message subject and body |
| `messages.list` | `surveymonkey.api.messages.list` | `read` | List the invite and reminder messages of a collector |
| `messages.send` | `surveymonkey.api.messages.send` | `write` | Send a message to every recipient on it. This mails real people, so check the recipients first |
| `messages.update` | `surveymonkey.api.messages.update` | `write` | Change a message subject, body or type before it is sent |
| `pages.create` | `surveymonkey.api.pages.create` | `write` | Add a page to a survey, optionally at a given position |
| `pages.delete` | `surveymonkey.api.pages.delete` | `destructive` | Delete a page and the questions on it. There is no undo |
| `pages.get` | `surveymonkey.api.pages.get` | `read` | Read one page of a survey |
| `pages.list` | `surveymonkey.api.pages.list` | `read` | List the pages of a survey in their order |
| `pages.update` | `surveymonkey.api.pages.update` | `write` | Change a page title, description or position |
| `questions.create` | `surveymonkey.api.questions.create` | `write` | Add a question to a page. The family and subtype decide the question type, and the headings carry the text |
| `questions.delete` | `surveymonkey.api.questions.delete` | `destructive` | Delete a question and the answers recorded for it. There is no undo |
| `questions.get` | `surveymonkey.api.questions.get` | `read` | Read one question with its choices and settings |
| `questions.list` | `surveymonkey.api.questions.list` | `read` | List the questions on one page of a survey |
| `questions.update` | `surveymonkey.api.questions.update` | `write` | Change a question heading, position, required rule, visibility or choices |
| `recipients.bulkCreate` | `surveymonkey.api.recipients.bulkCreate` | `write` | Add up to a few hundred recipients to a message in one call |
| `recipients.create` | `surveymonkey.api.recipients.create` | `write` | Add one recipient to a message by email address |
| `recipients.list` | `surveymonkey.api.recipients.list` | `read` | List the recipients on one message with their delivery status |
| `responses.create` | `surveymonkey.api.responses.create` | `write` | Record a response through a collector, as data entry. Nothing is mailed to a respondent |
| `responses.delete` | `surveymonkey.api.responses.delete` | `destructive` | Delete one response and its answers. The counts on the survey change and there is no undo |
| `responses.deleteAll` | `surveymonkey.api.responses.deleteAll` | `destructive` | Delete every response a collector gathered. There is no undo, and the collector stays open |
| `responses.get` | `surveymonkey.api.responses.get` | `read` | Read one response with its answers |
| `responses.getDetails` | `surveymonkey.api.responses.getDetails` | `read` | Read one response with its answers and the page and question detail |
| `responses.list` | `surveymonkey.api.responses.list` | `read` | List a survey response ids, filtered by date or status. Read one to see the answers |
| `responses.listBulk` | `surveymonkey.api.responses.listBulk` | `read` | List survey responses with their answers in one call, up to 100 a page |
| `surveys.create` | `surveymonkey.api.surveys.create` | `write` | Create an empty survey, or a copy of a template or an existing survey |
| `surveys.delete` | `surveymonkey.api.surveys.delete` | `destructive` | Delete a survey and its responses. There is no undo and the questions go with it |
| `surveys.get` | `surveymonkey.api.surveys.get` | `read` | Read one survey with its counts, links and response count |
| `surveys.getDetails` | `surveymonkey.api.surveys.getDetails` | `read` | Read a survey with every page and question, including choice ids and values |
| `surveys.list` | `surveymonkey.api.surveys.list` | `read` | List surveys in last-modified order, filtered by title, folder or modification date |
| `surveys.listCategories` | `surveymonkey.api.surveys.listCategories` | `read` | List the survey categories available for the language |
| `surveys.listLanguages` | `surveymonkey.api.surveys.listLanguages` | `read` | List the languages a survey can be written in |
| `surveys.listTemplates` | `surveymonkey.api.surveys.listTemplates` | `read` | List the survey templates, optionally filtered by language or category |
| `surveys.replace` | `surveymonkey.api.surveys.replace` | `write` | Replace a survey wholesale. Fields left out reset to their defaults, so prefer update |
| `surveys.update` | `surveymonkey.api.surveys.update` | `write` | Change a survey title, nickname, language, button text, variables or folder |
| `users.getMe` | `surveymonkey.api.users.getMe` | `read` | Read the account the token belongs to, which is the cheapest connection check |
| `webhooks.create` | `surveymonkey.api.webhooks.create` | `write` | Subscribe a URL to an event on a survey or collector. SurveyMonkey then POSTs to it |
| `webhooks.delete` | `surveymonkey.api.webhooks.delete` | `destructive` | Delete a webhook subscription. The URL stops receiving events |
| `webhooks.get` | `surveymonkey.api.webhooks.get` | `read` | Read one webhook subscription |
| `webhooks.list` | `surveymonkey.api.webhooks.list` | `read` | List the webhooks on the account and what they subscribe to |
| `webhooks.update` | `surveymonkey.api.webhooks.update` | `write` | Change a webhook event, target objects or subscription URL |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/surveymonkey

## License

Apache-2.0
