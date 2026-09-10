# @corsair-dev/sharepoint

Sharepoint plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/sharepoint
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `contentTypes.addFieldLink` | `sharepoint.api.contentTypes.addFieldLink` | `write` | Add a field link to a list content type |
| `contentTypes.create` | `sharepoint.api.contentTypes.create` | `write` | Create a new SharePoint content type |
| `contentTypes.createListField` | `sharepoint.api.contentTypes.createListField` | `write` | Create a new field (column) on a SharePoint list |
| `contentTypes.get` | `sharepoint.api.contentTypes.get` | `read` | Get a SharePoint content type by ID |
| `contentTypes.getAll` | `sharepoint.api.contentTypes.getAll` | `read` | Get all content types defined on the site |
| `contentTypes.getById` | `sharepoint.api.contentTypes.getById` | `read` | Get a content type from a list by its ID |
| `contentTypes.getForList` | `sharepoint.api.contentTypes.getForList` | `read` | Get content types available for a specific list |
| `contentTypes.update` | `sharepoint.api.contentTypes.update` | `write` | Update an existing SharePoint content type |
| `drive.createSharingLink` | `sharepoint.api.drive.createSharingLink` | `write` | Create a sharing link for a drive item via Graph API |
| `drive.deleteVersion` | `sharepoint.api.drive.deleteVersion` | `destructive` | Delete a specific version of a drive item [DESTRUCTIVE] |
| `drive.getAnalytics` | `sharepoint.api.drive.getAnalytics` | `read` | Get analytics for a SharePoint drive item via Graph API |
| `drive.listRecentItems` | `sharepoint.api.drive.listRecentItems` | `read` | List recently accessed drive items via Graph API |
| `drive.restoreVersion` | `sharepoint.api.drive.restoreVersion` | `write` | Restore a previous version of a drive item via Graph API |
| `drive.updateItem` | `sharepoint.api.drive.updateItem` | `write` | Update a drive item (rename, move) via Graph API |
| `files.checkIn` | `sharepoint.api.files.checkIn` | `write` | Check in a SharePoint file to publish changes |
| `files.checkOut` | `sharepoint.api.files.checkOut` | `write` | Check out a SharePoint file for exclusive editing |
| `files.download` | `sharepoint.api.files.download` | `read` | Download a file by its server-relative URL |
| `files.get` | `sharepoint.api.files.get` | `read` | Get metadata of a SharePoint file by server-relative URL |
| `files.listInFolder` | `sharepoint.api.files.listInFolder` | `read` | List all files in a SharePoint folder |
| `files.recycle` | `sharepoint.api.files.recycle` | `write` | Move a SharePoint file to the recycle bin |
| `files.undoCheckout` | `sharepoint.api.files.undoCheckout` | `write` | Undo a checked-out SharePoint file |
| `files.upload` | `sharepoint.api.files.upload` | `write` | Upload a file to a SharePoint document library folder |
| `folders.create` | `sharepoint.api.folders.create` | `write` | Create a new SharePoint folder |
| `folders.delete` | `sharepoint.api.folders.delete` | `destructive` | Delete a SharePoint folder and all its contents [DESTRUCTIVE] |
| `folders.get` | `sharepoint.api.folders.get` | `read` | Get a SharePoint folder by server-relative URL |
| `folders.getAll` | `sharepoint.api.folders.getAll` | `read` | Get all SharePoint folders in a list or location |
| `folders.listSubfolders` | `sharepoint.api.folders.listSubfolders` | `read` | List subfolders inside a SharePoint folder |
| `folders.rename` | `sharepoint.api.folders.rename` | `write` | Rename a SharePoint folder |
| `items.addAttachment` | `sharepoint.api.items.addAttachment` | `write` | Add a file attachment to a SharePoint list item |
| `items.create` | `sharepoint.api.items.create` | `write` | Create a new SharePoint list item |
| `items.createByGuid` | `sharepoint.api.items.createByGuid` | `write` | Create a new item in a SharePoint list by GUID |
| `items.createInFolder` | `sharepoint.api.items.createInFolder` | `write` | Create a new list item inside a specific folder |
| `items.delete` | `sharepoint.api.items.delete` | `destructive` | Permanently delete a SharePoint list item [DESTRUCTIVE] |
| `items.get` | `sharepoint.api.items.get` | `read` | Get a SharePoint list item by ID |
| `items.getAttachmentContent` | `sharepoint.api.items.getAttachmentContent` | `read` | Download the content of a list item attachment |
| `items.getEtag` | `sharepoint.api.items.getEtag` | `read` | Get the ETag for a SharePoint list item |
| `items.getVersion` | `sharepoint.api.items.getVersion` | `read` | Get a specific version of a SharePoint list item |
| `items.list` | `sharepoint.api.items.list` | `read` | List items in a SharePoint list |
| `items.listAttachments` | `sharepoint.api.items.listAttachments` | `read` | List all attachments for a SharePoint list item |
| `items.listByGuid` | `sharepoint.api.items.listByGuid` | `read` | List items in a SharePoint list by GUID |
| `items.recycle` | `sharepoint.api.items.recycle` | `write` | Move a SharePoint list item to the recycle bin |
| `items.update` | `sharepoint.api.items.update` | `write` | Update an existing SharePoint list item |
| `lists.create` | `sharepoint.api.lists.create` | `write` | Create a new SharePoint list |
| `lists.delete` | `sharepoint.api.lists.delete` | `destructive` | Delete a SharePoint list by GUID [DESTRUCTIVE] |
| `lists.deleteByTitle` | `sharepoint.api.lists.deleteByTitle` | `destructive` | Delete a SharePoint list by title [DESTRUCTIVE] |
| `lists.getByGuid` | `sharepoint.api.lists.getByGuid` | `read` | Get a SharePoint list by GUID |
| `lists.getByTitle` | `sharepoint.api.lists.getByTitle` | `read` | Get a SharePoint list by title |
| `lists.getChanges` | `sharepoint.api.lists.getChanges` | `read` | Get change log entries for a SharePoint list |
| `lists.listAll` | `sharepoint.api.lists.listAll` | `read` | List all SharePoint lists in the site |
| `lists.listColumns` | `sharepoint.api.lists.listColumns` | `read` | List all columns (fields) in a SharePoint list |
| `lists.renderDataAsStream` | `sharepoint.api.lists.renderDataAsStream` | `read` | Render list data as a pageable stream |
| `lists.update` | `sharepoint.api.lists.update` | `write` | Update an existing SharePoint list |
| `permissions.addRoleToItem` | `sharepoint.api.permissions.addRoleToItem` | `write` | Grant a role assignment to a user on a list item |
| `permissions.addRoleToList` | `sharepoint.api.permissions.addRoleToList` | `write` | Grant a role assignment to a user on a SharePoint list |
| `permissions.breakInheritanceOnItem` | `sharepoint.api.permissions.breakInheritanceOnItem` | `write` | Break permission inheritance on a list item |
| `permissions.breakInheritanceOnList` | `sharepoint.api.permissions.breakInheritanceOnList` | `write` | Break permission inheritance on a SharePoint list |
| `permissions.getRoleDefinitions` | `sharepoint.api.permissions.getRoleDefinitions` | `read` | Get all role definitions (permission levels) in the site |
| `recycleBin.deletePermanent` | `sharepoint.api.recycleBin.deletePermanent` | `destructive` | Permanently delete an item from the recycle bin [DESTRUCTIVE] |
| `recycleBin.list` | `sharepoint.api.recycleBin.list` | `read` | List items in the SharePoint recycle bin |
| `recycleBin.restore` | `sharepoint.api.recycleBin.restore` | `write` | Restore an item from the SharePoint recycle bin |
| `search.query` | `sharepoint.api.search.query` | `read` | Execute a full-text search query against SharePoint |
| `search.suggest` | `sharepoint.api.search.suggest` | `read` | Get query suggestions from SharePoint search |
| `social.follow` | `sharepoint.api.social.follow` | `write` | Follow a SharePoint actor (person, document, site, tag) |
| `social.getFollowed` | `sharepoint.api.social.getFollowed` | `read` | Get entities followed by the current user |
| `social.getFollowers` | `sharepoint.api.social.getFollowers` | `read` | Get followers of the current user |
| `social.isFollowed` | `sharepoint.api.social.isFollowed` | `read` | Check if the current user is following an actor |
| `users.create` | `sharepoint.api.users.create` | `write` | Add an Azure AD user to the SharePoint site |
| `users.ensure` | `sharepoint.api.users.ensure` | `write` | Ensure a user exists in SharePoint (create if not present) |
| `users.find` | `sharepoint.api.users.find` | `read` | Find SharePoint users by name or email |
| `users.getCurrent` | `sharepoint.api.users.getCurrent` | `read` | Get the currently authenticated SharePoint user |
| `users.getEffectivePermissions` | `sharepoint.api.users.getEffectivePermissions` | `read` | Get the effective permissions of a user on the web |
| `users.getGroupUsers` | `sharepoint.api.users.getGroupUsers` | `read` | Get users belonging to a SharePoint site group by name |
| `users.getGroupUsersById` | `sharepoint.api.users.getGroupUsersById` | `read` | Get users belonging to a SharePoint site group by ID |
| `users.listGroups` | `sharepoint.api.users.listGroups` | `read` | List all site groups |
| `users.listSite` | `sharepoint.api.users.listSite` | `read` | List all users in the SharePoint site |
| `users.remove` | `sharepoint.api.users.remove` | `destructive` | Remove a user from the SharePoint site [DESTRUCTIVE] |
| `web.createSubsite` | `sharepoint.api.web.createSubsite` | `write` | Create a new SharePoint subsite |
| `web.getContextInfo` | `sharepoint.api.web.getContextInfo` | `read` | Get SharePoint context info including form digest token |
| `web.getDriveItemByPath` | `sharepoint.api.web.getDriveItemByPath` | `read` | Get a drive item by its path using Microsoft Graph |
| `web.getInfo` | `sharepoint.api.web.getInfo` | `read` | Get information about the current SharePoint web/site |
| `web.getSiteCollectionInfo` | `sharepoint.api.web.getSiteCollectionInfo` | `read` | Get information about the SharePoint site collection |
| `web.getSitePage` | `sharepoint.api.web.getSitePage` | `read` | Get the content of a SharePoint modern site page |
| `web.logEvent` | `sharepoint.api.web.logEvent` | `write` | Log a custom event to the SharePoint ULS log |
| `web.updateSite` | `sharepoint.api.web.updateSite` | `write` | Update SharePoint site title or description |
| `webhookSubscriptions.get` | `sharepoint.api.webhookSubscriptions.get` | `read` | Get a specific SharePoint webhook subscription |
| `webhookSubscriptions.getAll` | `sharepoint.api.webhookSubscriptions.getAll` | `read` | Get all webhook subscriptions for a SharePoint list |

## Auth

Auth: OAuth 2.0, Managed OAuth (default OAuth 2.0). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/sharepoint

## License

Apache-2.0
