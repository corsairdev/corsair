### What API or service would you like integrated?

Cloudinary

### API documentation link

https://cloudinary.com/documentation/programmable_media_overview#landingpage

### What would you like to do with this integration?

Implement as per plugin requirements given on OSS

* Activate Live Stream
* Create Asset Relations by Asset ID
* Create Asset Relations by Public ID
* Create Folder
* Create Image from Text
* Create Live Stream
* Create Live Stream Output
* Create Metadata Field
* Create Metadata Rule
* Create Multi-Resource Animation
* Create Slideshow
* Create Streaming Profile
* Create Transformation
* Create Trigger
* Create Upload Mapping
* Create Upload Preset
* Delete Asset Relations by Asset ID
* Delete Asset Relations by Public ID
* Delete Derived Resources
* Delete Folder
* Delete Live Stream
* Delete Live Stream Output
* Delete Metadata Field
* Delete Metadata Field Datasource Entries
* Delete Metadata Rule
* Delete Resources by Asset ID
* Delete Resources by Public ID
* Delete Resources by Tags
* Delete Streaming Profile
* Delete Transformation (v2)
* Delete Trigger
* Delete Upload Mapping
* Delete Upload Preset
* Destroy Asset
* Destroy Asset by ID
* Explicit Resource Update
* Explode Multi-Page Resource
* Generate Archive
* Generate Sprite
* Get Adaptive Streaming Profiles
* Get Analysis Task Status
* Get Live Stream
* Get Live Stream Output
* Get Live Stream Outputs
* Get Live Streams
* Get Metadata Field By ID
* Get Resource Tags
* Get Resource by Asset ID
* Get Resource by Public ID
* Get Resources by Asset Folder
* Get Resources by Context
* Get Resources in Moderation
* Get Root Folders
* Get Streaming Profile Details
* Get Transformation
* Get Transformations
* Get Upload Mapping Details
* Get Upload Mappings
* Get Upload Preset
* Get Usage
* Get Video Views
* Get Product Environment Config Details
* Idle Live Stream
* List Images
* List Metadata Fields
* List Metadata Rules
* List Raw Files
* List Resource Types
* List Resources by Asset IDs
* List Resources by External IDs
* List Resources by Tag
* List Resources by Type
* List Upload Presets
* List Video Assets
* List Webhook Triggers
* Manage Context Metadata
* Order Metadata Field Datasource
* Ping Cloudinary Servers
* Publish Resources
* Rename or Move Resource Public ID
* Reorder Metadata Field
* Reorder Metadata Fields
* Restore Deleted Resources
* Restore Metadata Field Datasource Entries
* Restore Resources by Asset IDs
* Search All Metadata Field Datasources
* Search Assets
* Search Datasource in Metadata Field
* Search Folders
* Search Folders (V2)
* Show Folder
* Update Asset Metadata
* Update Folder
* Update Live Stream
* Update Live Stream Output
* Update Metadata Field
* Update Metadata Field Datasource
* Update Metadata Rule
* Update Resource Tags
* Update Resource by Asset ID
* Update Resource by Public ID
* Update Streaming Profile
* Update Transformation (v2)
* Update Trigger
* Update Upload Mapping
* Update Upload Preset
* Upload Asset
* Upload File (Auto Detect)
* Upload File Chunk
* Visual Search Assets

### Do you need webhook support?

- [x] Yes, I need webhook support for this integration

### Webhook details (if applicable)

Optional Cloudinary notification webhooks are implemented (not required for OSS plugin compliance, but supported for real-time asset sync).

**Verification**

- Headers: `X-Cld-Signature`, `X-Cld-Timestamp`
- Signature: SHA-1 over `payload + timestamp + api_secret` (or dedicated `webhook_signature` if configured)

**Notification handlers**

| Group | Handler | `notification_type` | Description |
|-------|---------|---------------------|-------------|
| upload | `upload.upload` | `upload` | Upload completed |
| eager | `eager.eager` | `eager` | Eager transformation completed |
| delete | `delete.delete` | `delete` | Asset deleted |
| rename | `rename.rename` | `rename` | Asset renamed |
| resource | `resource.resourceTagsChanged` | `resource_tags_changed` | Resource tags changed |
| resource | `resource.resourceContextChanged` | `resource_context_changed` | Resource context metadata changed |
| resource | `resource.resourceMetadataChanged` | `resource_metadata_changed` | Structured metadata changed |
| folder | `folder.createFolder` | `create_folder` | Folder created |
| folder | `folder.deleteFolder` | `delete_folder` | Folder deleted |
| folder | `folder.move` | `move` | Asset moved between folders |
| other | `other.explode` | `explode` | Explode processing completed |
| other | `other.accessControlChanged` | `access_control_changed` | Access control changed |
| other | `other.relatedAssets` | `related_assets` | Related assets changed |

Upload/delete notifications sync the local `resources` entity when applicable.

Docs: https://cloudinary.com/documentation/notifications

### Additional context

* Authentication: **API Key** (OSS requirement)
* No OAuth required.
* Webhook support: **optional** — 13 Cloudinary notification types implemented with signature verification (see above).
* Initial implementation covers the API surface currently listed on the Corsair OSS catalog (100 operations).

**Required environment / account fields**

| Variable / field | Required | Description |
|------------------|----------|-------------|
| `api_key` / `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `api_secret` / `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret (also used for upload signing) |
| `cloud_name` / `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name for Admin/Upload/Live API requests |
| `webhook_signature` / `webhookSecret` | No | Dedicated webhook signing secret; falls back to `api_secret` if unset |

**Optional test environment variables** (`packages/cloudinary/.env`)

| Variable | Description |
|----------|-------------|
| `CLOUDINARY_TEST_PUBLIC_ID` | Public ID for `getResourceByPublicId` API test (auto-resolved from account if omitted) |
| `CLOUDINARY_TEST_RESOURCE_TYPE` | Resource type for get-by-public-id test (default: `image`) |
| `CLOUDINARY_TEST_DELIVERY_TYPE` | Delivery type for get-by-public-id test (default: `upload`) |

**API bases**

* Admin API: `https://api.cloudinary.com/v1_1/{cloud_name}`
* Upload API: signed form/multipart to `{cloud_name}/{resource_type}`
* Live Streaming API: `https://api.cloudinary.com/v2/video/{cloud_name}`
