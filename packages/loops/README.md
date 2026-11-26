# @corsair-dev/loops

Loops plugin for Corsair: contacts, lists, events, transactional email, campaigns, workflows, email content, metrics and signed webhooks.

## Install

```bash
pnpm add @corsair-dev/loops
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apikey.verifyConnection` | `loops.api.apikey.verifyConnection` | `read` | Verify the API key and return the team name it belongs to |
| `audienceSegments.create` | `loops.api.audienceSegments.create` | `write` | Create a new audience segment. |
| `audienceSegments.get` | `loops.api.audienceSegments.get` | `read` | Retrieve a single audience segment by ID. |
| `audienceSegments.list` | `loops.api.audienceSegments.list` | `read` | Retrieve a paginated list of audience segments, most recently created first. |
| `campaignGroups.create` | `loops.api.campaignGroups.create` | `write` | Create a new campaign group. |
| `campaignGroups.get` | `loops.api.campaignGroups.get` | `read` | Retrieve a single campaign group by ID. |
| `campaignGroups.list` | `loops.api.campaignGroups.list` | `read` | Retrieve a paginated list of campaign groups, most recently created first. |
| `campaignGroups.update` | `loops.api.campaignGroups.update` | `write` | Update a campaign group's name or description. At least one field must be provided. The reserved "Unsorted" group cannot be edited. |
| `campaigns.create` | `loops.api.campaigns.create` | `destructive` | Create a new draft campaign. An empty email message is created automatically and its `emailMessageId` is returned. Use the `/email-messages/{emailMessageId}` endpoint to set subject, sender, preview text, and LMX content. Passing scheduling { method: "now" } sends the campaign to its whole audience right away. |
| `campaigns.get` | `loops.api.campaigns.get` | `read` | Retrieve a single campaign by ID. |
| `campaigns.getMetrics` | `loops.api.campaigns.getMetrics` | `read` | Retrieve all-time email engagement metrics for a campaign. |
| `campaigns.list` | `loops.api.campaigns.list` | `read` | Retrieve a paginated list of campaigns. |
| `campaigns.update` | `loops.api.campaigns.update` | `destructive` | Update a draft campaign's name, group, audience (mailing list, segment, or filter), or scheduling. At least one field must be provided. Once a campaign has been sent, only its `name` and `campaignGroupId` can be updated. Passing scheduling { method: "now" } on a draft sends it to its whole audience right away. |
| `components.create` | `loops.api.components.create` | `write` | Create a new email component from an LMX body. |
| `components.get` | `loops.api.components.get` | `read` | Retrieve a single component by ID. |
| `components.list` | `loops.api.components.list` | `read` | Retrieve a paginated list of email components. |
| `components.update` | `loops.api.components.update` | `write` | Update a component's name and/or body. When the `lmx` body changes, the update cascades to every email using this component, and `affectedEmailCount` reports how many were affected. |
| `contacts.create` | `loops.api.contacts.create` | `write` | Create a contact with fixed and custom properties; answers 409 when the email or userId already exists |
| `contacts.createProperty` | `loops.api.contacts.createProperty` | `write` | Create a custom contact property. |
| `contacts.delete` | `loops.api.contacts.delete` | `destructive` | Permanently delete a contact by email or userId; the contact and its subscriptions cannot be restored |
| `contacts.find` | `loops.api.contacts.find` | `read` | Find contacts by email or user ID; answers an empty array when none match |
| `contacts.getSuppression` | `loops.api.contacts.getSuppression` | `read` | Read whether a contact is suppressed from emails and the quota left for removing suppressions |
| `contacts.listProperties` | `loops.api.contacts.listProperties` | `read` | List the contact property definitions, all of them or only the custom ones |
| `contacts.removeSuppression` | `loops.api.contacts.removeSuppression` | `destructive` | Remove a suppressed contact from the suppression list by `email` or `userId`. Include only one query parameter. Uses one of a small rolling 30-day removal quota; the address can receive email again. |
| `contacts.update` | `loops.api.contacts.update` | `write` | Update a contact found by email or userId, creating it when no match exists (upsert) |
| `dedicatedSendingIps.list` | `loops.api.dedicatedSendingIps.list` | `read` | Retrieve a list of Loops' dedicated sending IP addresses. This endpoint is provided for the rare instances where you may need to whitelist our sending IPs. |
| `emailMessages.get` | `loops.api.emailMessages.get` | `read` | Retrieve an email message, including its compiled LMX content. |
| `emailMessages.render` | `loops.api.emailMessages.render` | `read` | Render the HTML of an email message the way its preview email is rendered. Nothing is sent. |
| `emailMessages.runGuardian` | `loops.api.emailMessages.runGuardian` | `read` | Validate an email message's content against Guardian rules and return any errors and warnings. Errors must be resolved before the email can be published, warnings are advisory. |
| `emailMessages.sendPreview` | `loops.api.emailMessages.sendPreview` | `destructive` | Send a test preview of an email message to one or more addresses. Sends real preview emails to every listed address. |
| `emailMessages.update` | `loops.api.emailMessages.update` | `write` | Update fields on an email message (subject, preview text, sender, LMX content). A campaign must be in draft status. You can only edit the draft email message of a transactional email. A workflow must not be sending. |
| `eventPatterns.get` | `loops.api.eventPatterns.get` | `read` | Retrieve event pattern details for a workflow event trigger. |
| `eventPatterns.getByName` | `loops.api.eventPatterns.getByName` | `read` | Retrieve event pattern details by event name for a workflow event trigger. Event names are case-sensitive, so `PaymentReceived` and `paymentReceived` are different events. |
| `eventPatterns.list` | `loops.api.eventPatterns.list` | `read` | Retrieve a paginated list of event patterns available to workflow event trigger nodes. |
| `events.send` | `loops.api.events.send` | `destructive` | Send an event for a contact; this can trigger workflows that email real people |
| `footers.create` | `loops.api.footers.create` | `write` | Create a footer with one variant. The variant starts with an unpublished draft that has the company name, company address and unsubscribe link. Emails cannot use the footer until you publish the variant. |
| `footers.delete` | `loops.api.footers.delete` | `destructive` | Delete a footer and its variants. You cannot delete the team's default footer or a footer that emails use. |
| `footers.get` | `loops.api.footers.get` | `read` | Retrieve a single footer by ID, with the content of each variant. |
| `footers.getVariant` | `loops.api.footers.getVariant` | `read` | Retrieve a footer variant's draft and published content as LMX. |
| `footers.list` | `loops.api.footers.list` | `read` | Retrieve a paginated list of footers, most recently created first. |
| `footers.publishVariant` | `loops.api.footers.publishVariant` | `destructive` | Publish the variant's draft LMX content, to replace the current published LMX content. Emails that use the footer will immediately use the newly published content. |
| `footers.setDefault` | `loops.api.footers.setDefault` | `write` | Make a published footer the team's default footer. New campaign and workflow emails use the default footer. `existingEmails` picks which existing emails switch to it. With `none`, only new emails use it. |
| `footers.update` | `loops.api.footers.update` | `write` | Update a footer's name or placement. Changes apply at once, also to running workflows. Emails already sent don't change. To change the default footer, use `POST /v1/footers/{footerId}/set-default`. |
| `footers.updateVariant` | `loops.api.footers.updateVariant` | `write` | Update a footer variant's LMX content. Emails keep the variant's published content until you publish the updated variant. |
| `lists.list` | `loops.api.lists.list` | `read` | List every mailing list in the team |
| `themes.create` | `loops.api.themes.create` | `write` | Create a new email theme for use across Loops emails. |
| `themes.get` | `loops.api.themes.get` | `read` | Retrieve a single theme by ID. |
| `themes.list` | `loops.api.themes.list` | `read` | Retrieve a paginated list of email themes, most recently created first. |
| `themes.update` | `loops.api.themes.update` | `write` | Update a theme's name and/or styles. When `styles` change, the update cascades to every email using this theme, and `affectedEmailCount` in the response reports how many emails were affected. |
| `transactional.list` | `loops.api.transactional.list` | `read` | Get a list of published transactional emails. |
| `transactional.send` | `loops.api.transactional.send` | `destructive` | Send a published transactional email to a real inbox; pass an idempotencyKey (max 100 chars) to make a retry within 24 hours return 409 instead of a duplicate |
| `transactionalEmails.create` | `loops.api.transactionalEmails.create` | `write` | Create a new transactional email. An empty draft email message is created automatically and its `draftEmailMessageId` is returned. |
| `transactionalEmails.ensureDraft` | `loops.api.transactionalEmails.ensureDraft` | `write` | Ensure the transactional email has a draft email message. If a draft already exists it is returned unchanged; otherwise a new empty draft is created (seeded from the most recent published version when present). |
| `transactionalEmails.get` | `loops.api.transactionalEmails.get` | `read` | Retrieve a single transactional email by ID. |
| `transactionalEmails.getMetrics` | `loops.api.transactionalEmails.getMetrics` | `read` | Retrieve all-time delivery metrics for a transactional email, totalled across every published version. |
| `transactionalEmails.list` | `loops.api.transactionalEmails.list` | `read` | Retrieve a paginated list of transactional emails, most recently created first. |
| `transactionalEmails.publish` | `loops.api.transactionalEmails.publish` | `destructive` | Publish the transactional email's current draft email message. The draft becomes the published version and the draft is cleared. |
| `transactionalEmails.update` | `loops.api.transactionalEmails.update` | `write` | Update a transactional email's name or group. At least one field must be provided. |
| `transactionalGroups.create` | `loops.api.transactionalGroups.create` | `write` | Create a new transactional group. |
| `transactionalGroups.get` | `loops.api.transactionalGroups.get` | `read` | Retrieve a single transactional group by ID. |
| `transactionalGroups.list` | `loops.api.transactionalGroups.list` | `read` | Retrieve a paginated list of transactional groups, most recently created first. |
| `transactionalGroups.update` | `loops.api.transactionalGroups.update` | `write` | Update a transactional group's name or description. At least one field must be provided. The reserved "Unsorted" group cannot be edited. |
| `uploads.complete` | `loops.api.uploads.complete` | `write` | Finalize an image upload after the file has been uploaded to the pre-signed URL. Returns the public URL of the uploaded image asset. |
| `uploads.create` | `loops.api.uploads.create` | `write` | Request a pre-signed URL to upload an image asset. Upload the file with an HTTP `PUT` to the returned `presignedUrl` (sending the same `Content-Type` and `Content-Length`), then call `/uploads/{emailAssetId}/complete` to finalize the asset. Answers a presigned URL; PUT the file bytes there yourself, then call uploads.complete. |
| `workflowGroups.create` | `loops.api.workflowGroups.create` | `write` | Create a new workflow group. |
| `workflowGroups.get` | `loops.api.workflowGroups.get` | `read` | Retrieve a single workflow group by ID. |
| `workflowGroups.list` | `loops.api.workflowGroups.list` | `read` | Retrieve a paginated list of workflow groups, most recently created first. |
| `workflowGroups.update` | `loops.api.workflowGroups.update` | `write` | Update a workflow group's name or description. At least one field must be provided. The reserved "Unsorted" group cannot be edited. |
| `workflowNodes.addBranch` | `loops.api.workflowNodes.addBranch` | `write` | Add a branch and a child node under an existing Branch or Experiment node. Returns the created child node plus the latest workflow. - Adding a branch to a `BranchNode` creates one `AudienceFilter` child node. |
| `workflowNodes.create` | `loops.api.workflowNodes.create` | `write` | Create a new default workflow node and return it with the latest workflow. |
| `workflowNodes.delete` | `loops.api.workflowNodes.delete` | `destructive` | Delete a single workflow node. If contacts are queued at the node, Loops returns with `"status": "queuedContactsFound"` instead of deleting. Retry with `queuedContactPolicy: "discard"` to delete the node and discard those queued contacts. |
| `workflowNodes.deleteRecursive` | `loops.api.workflowNodes.deleteRecursive` | `destructive` | Delete a node and its downstream subtree. If contacts are queued at any node that would be deleted, Loops returns with `"status": "queuedContactsFound"` instead of deleting. |
| `workflowNodes.get` | `loops.api.workflowNodes.get` | `read` | Retrieve detailed data for a single workflow node. |
| `workflowNodes.getMetrics` | `loops.api.workflowNodes.getMetrics` | `read` | Retrieve all-time email engagement metrics for a workflow `SendEmailAction` node. Nodes of any other type return a `400` response. A `SendEmailAction` node with an email that has not sent anything yet reports every counter as `0`. |
| `workflowNodes.reroute` | `loops.api.workflowNodes.reroute` | `write` | Reroute the source node's existing connection to another valid target node. Returns the updated source node and the latest workflow. |
| `workflowNodes.update` | `loops.api.workflowNodes.update` | `write` | Update workflow-node-owned fields for a single node. To update a node, the workflow's `state` must not be `Sending`. Shared resources such as email messages and audience segments should be updated through their own APIs. |
| `workflows.changeMailingList` | `loops.api.workflows.changeMailingList` | `destructive` | Dry run or apply a workflow mailing list change. If queued contacts would be removed from the workflow due to the change of mailing list, Loops returns with `"status": "queuedContactsFound"` instead of applying the change. |
| `workflows.create` | `loops.api.workflows.create` | `write` | Create a draft workflow with a blank trigger and exit node. When `workflowGroupId` is omitted, the workflow is added to the team's Unsorted group. |
| `workflows.delete` | `loops.api.workflows.delete` | `destructive` | Delete a workflow. Successful deletion returns `204 No Content`. If the workflow is currently sending or has queued contacts, Loops returns `409 Conflict` with a message instead of deleting. |
| `workflows.get` | `loops.api.workflows.get` | `read` | Retrieve a workflow graph with node type names, connections, and selected display fields. |
| `workflows.list` | `loops.api.workflows.list` | `read` | Retrieve a paginated list of workflows. |
| `workflows.update` | `loops.api.workflows.update` | `write` | Update a workflow's name, description, or group. At least one field must be provided. To change the workflow's mailing list, use the `POST /v1/workflows/{workflowId}/mailing-list` endpoint instead. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 17 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/loops

## License

Apache-2.0
