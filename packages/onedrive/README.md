# @corsair-dev/onedrive

onedrive plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/onedrive
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `drive.get` | `onedrive.api.drive.get` | `read` | Get a drive by ID |
| `drive.getGroup` | `onedrive.api.drive.getGroup` | `read` | Get a group's drive |
| `drive.getQuota` | `onedrive.api.drive.getQuota` | `read` | Get the user's drive and quota information |
| `drive.getRecentItems` | `onedrive.api.drive.getRecentItems` | `read` | Get recently accessed drive items |
| `drive.getRoot` | `onedrive.api.drive.getRoot` | `read` | Get the root folder of the user's drive |
| `drive.getSharedItems` | `onedrive.api.drive.getSharedItems` | `read` | Get items shared with the user |
| `drive.getSpecialFolder` | `onedrive.api.drive.getSpecialFolder` | `read` | Get a special folder (documents, photos, cameraroll) |
| `drive.list` | `onedrive.api.drive.list` | `read` | List available drives |
| `drive.listActivities` | `onedrive.api.drive.listActivities` | `read` | List activities across the drive |
| `drive.listBundles` | `onedrive.api.drive.listBundles` | `read` | List bundles in a drive |
| `drive.listChanges` | `onedrive.api.drive.listChanges` | `read` | List changes to drive items using delta |
| `files.createFolder` | `onedrive.api.files.createFolder` | `write` | Create a new folder |
| `files.createTextFile` | `onedrive.api.files.createTextFile` | `write` | Create a new text file with content |
| `files.findFile` | `onedrive.api.files.findFile` | `read` | Find a file by name |
| `files.findFolder` | `onedrive.api.files.findFolder` | `read` | Find a folder by name |
| `files.list` | `onedrive.api.files.list` | `read` | List files in the root drive |
| `files.upload` | `onedrive.api.files.upload` | `write` | Upload a file to OneDrive |
| `items.checkin` | `onedrive.api.items.checkin` | `write` | Check in a checked-out drive item |
| `items.checkout` | `onedrive.api.items.checkout` | `write` | Check out a drive item for editing |
| `items.copy` | `onedrive.api.items.copy` | `write` | Copy a drive item |
| `items.delete` | `onedrive.api.items.delete` | `destructive` | Delete a drive item [DESTRUCTIVE] |
| `items.deletePermanently` | `onedrive.api.items.deletePermanently` | `destructive` | Permanently delete a drive item [DESTRUCTIVE] |
| `items.discardCheckout` | `onedrive.api.items.discardCheckout` | `write` | Discard the checkout of a drive item |
| `items.download` | `onedrive.api.items.download` | `read` | Download a file |
| `items.downloadAsFormat` | `onedrive.api.items.downloadAsFormat` | `read` | Download a file converted to a different format |
| `items.downloadByPath` | `onedrive.api.items.downloadByPath` | `read` | Download a file by path |
| `items.downloadVersion` | `onedrive.api.items.downloadVersion` | `read` | Download a specific version of a file |
| `items.follow` | `onedrive.api.items.follow` | `write` | Follow a drive item |
| `items.get` | `onedrive.api.items.get` | `read` | Get a drive item by ID |
| `items.getDriveItemBySharingUrl` | `onedrive.api.items.getDriveItemBySharingUrl` | `read` | Get a drive item by sharing URL |
| `items.getFollowed` | `onedrive.api.items.getFollowed` | `read` | Get a followed drive item |
| `items.getThumbnails` | `onedrive.api.items.getThumbnails` | `read` | Get thumbnails for a drive item |
| `items.getVersions` | `onedrive.api.items.getVersions` | `read` | Get versions of a drive item |
| `items.listActivities` | `onedrive.api.items.listActivities` | `read` | List activities on a drive item |
| `items.listFolderChildren` | `onedrive.api.items.listFolderChildren` | `read` | List children of a folder |
| `items.move` | `onedrive.api.items.move` | `write` | Move a drive item to a new location |
| `items.preview` | `onedrive.api.items.preview` | `read` | Get a preview URL for a drive item |
| `items.restore` | `onedrive.api.items.restore` | `write` | Restore a deleted drive item |
| `items.search` | `onedrive.api.items.search` | `read` | Search for drive items |
| `items.unfollow` | `onedrive.api.items.unfollow` | `write` | Unfollow a drive item |
| `items.updateContent` | `onedrive.api.items.updateContent` | `write` | Update the content of a file |
| `items.updateMetadata` | `onedrive.api.items.updateMetadata` | `write` | Update metadata for a drive item |
| `permissions.createForItem` | `onedrive.api.permissions.createForItem` | `write` | Create a permission for a drive item |
| `permissions.createLink` | `onedrive.api.permissions.createLink` | `write` | Create a sharing link for a drive item |
| `permissions.deleteFromItem` | `onedrive.api.permissions.deleteFromItem` | `destructive` | Delete a permission from a drive item [DESTRUCTIVE] |
| `permissions.deleteSharePermission` | `onedrive.api.permissions.deleteSharePermission` | `destructive` | Delete a share permission [DESTRUCTIVE] |
| `permissions.getForItem` | `onedrive.api.permissions.getForItem` | `read` | Get permissions for a drive item |
| `permissions.getShare` | `onedrive.api.permissions.getShare` | `read` | Get a shared item by share ID or encoded URL |
| `permissions.grantSharePermission` | `onedrive.api.permissions.grantSharePermission` | `write` | Grant a permission on a shared item |
| `permissions.inviteUser` | `onedrive.api.permissions.inviteUser` | `write` | Invite a user to access a drive item |
| `permissions.listSharePermissions` | `onedrive.api.permissions.listSharePermissions` | `read` | List permissions on a shared drive item |
| `permissions.updateForItem` | `onedrive.api.permissions.updateForItem` | `write` | Update a permission on a drive item |
| `sharepoint.getListItems` | `onedrive.api.sharepoint.getListItems` | `read` | Get items from a SharePoint list |
| `sharepoint.getSite` | `onedrive.api.sharepoint.getSite` | `read` | Get a SharePoint site by ID |
| `sharepoint.getSitePage` | `onedrive.api.sharepoint.getSitePage` | `read` | Get a page from a SharePoint site |
| `sharepoint.listListItemsDelta` | `onedrive.api.sharepoint.listListItemsDelta` | `read` | List changes to SharePoint list items using delta |
| `sharepoint.listSiteColumns` | `onedrive.api.sharepoint.listSiteColumns` | `read` | List site columns in a SharePoint site |
| `sharepoint.listSiteItemsDelta` | `onedrive.api.sharepoint.listSiteItemsDelta` | `read` | List changes to all drive items in a site using delta |
| `sharepoint.listSiteLists` | `onedrive.api.sharepoint.listSiteLists` | `read` | List all lists in a SharePoint site |
| `sharepoint.listSiteSubsites` | `onedrive.api.sharepoint.listSiteSubsites` | `read` | List subsites of a SharePoint site |
| `subscriptions.list` | `onedrive.api.subscriptions.list` | `read` | List all active subscriptions |

## Auth

Auth: OAuth 2.0, Managed OAuth (default OAuth 2.0). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 2 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/onedrive

## License

Apache-2.0
