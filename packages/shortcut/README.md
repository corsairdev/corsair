# Shortcut plugin for Corsair

Shortcut API v3 integration covering 140 documented operations across workspace resources, stories, epics, comments, files, search, and related entities. The provider documents JSON over HTTPS and a limit of 200 requests per minute.

## Authentication

Provide a Shortcut API token as the Corsair API key. Requests send it in the `Shortcut-Token` header. The deprecated `token` query parameter is never used. Tokens have workspace access, so store them in Corsair key storage and do not log them.

## Operations

Every REST v3 OpenAPI operation compatible with Corsair is exposed. The operation input separates `path`, `query`, and `body` fields; request and response data are validated with Zod. `204 No Content` operations return `undefined`.

Documented nullable update fields accept `null` to unset the corresponding Shortcut property.

| Operation | Method | Route | Official reference |
|---|---|---|---|
| `listCategories.get` | GET | `/api/v3/categories` | [List Categories](https://developer.shortcut.com/api/rest/v3#List-Categories) |
| `createCategory.post` | POST | `/api/v3/categories` | [Create Category](https://developer.shortcut.com/api/rest/v3#Create-Category) |
| `getCategory.get` | GET | `/api/v3/categories/{category-public-id}` | [Get Category](https://developer.shortcut.com/api/rest/v3#Get-Category) |
| `updateCategory.put` | PUT | `/api/v3/categories/{category-public-id}` | [Update Category](https://developer.shortcut.com/api/rest/v3#Update-Category) |
| `deleteCategory.delete` | DELETE | `/api/v3/categories/{category-public-id}` | [Delete Category](https://developer.shortcut.com/api/rest/v3#Delete-Category) |
| `listCategoryMilestones.get` | GET | `/api/v3/categories/{category-public-id}/milestones` | [List Category Milestones](https://developer.shortcut.com/api/rest/v3#List-Category-Milestones) |
| `listCategoryObjectives.get` | GET | `/api/v3/categories/{category-public-id}/objectives` | [List Category Objectives](https://developer.shortcut.com/api/rest/v3#List-Category-Objectives) |
| `listCustomFields.get` | GET | `/api/v3/custom-fields` | [List Custom Fields](https://developer.shortcut.com/api/rest/v3#List-Custom-Fields) |
| `getCustomField.get` | GET | `/api/v3/custom-fields/{custom-field-public-id}` | [Get Custom Field](https://developer.shortcut.com/api/rest/v3#Get-Custom-Field) |
| `updateCustomField.put` | PUT | `/api/v3/custom-fields/{custom-field-public-id}` | [Update Custom Field](https://developer.shortcut.com/api/rest/v3#Update-Custom-Field) |
| `deleteCustomField.delete` | DELETE | `/api/v3/custom-fields/{custom-field-public-id}` | [Delete Custom Field](https://developer.shortcut.com/api/rest/v3#Delete-Custom-Field) |
| `listDocs.get` | GET | `/api/v3/documents` | [List Docs](https://developer.shortcut.com/api/rest/v3#List-Docs) |
| `createDoc.post` | POST | `/api/v3/documents` | [Create Doc](https://developer.shortcut.com/api/rest/v3#Create-Doc) |
| `getDoc.get` | GET | `/api/v3/documents/{doc-public-id}` | [Get Doc](https://developer.shortcut.com/api/rest/v3#Get-Doc) |
| `updateDoc.put` | PUT | `/api/v3/documents/{doc-public-id}` | [Update Doc](https://developer.shortcut.com/api/rest/v3#Update-Doc) |
| `deleteDoc.delete` | DELETE | `/api/v3/documents/{doc-public-id}` | [Delete Doc](https://developer.shortcut.com/api/rest/v3#Delete-Doc) |
| `listDocumentEpics.get` | GET | `/api/v3/documents/{doc-public-id}/epics` | [List Document Epics](https://developer.shortcut.com/api/rest/v3#List-Document-Epics) |
| `linkDocumentToEpic.put` | PUT | `/api/v3/documents/{doc-public-id}/epics/{epic-public-id}` | [Link Document to Epic](https://developer.shortcut.com/api/rest/v3#Link-Document-to-Epic) |
| `unlinkDocumentFromEpic.delete` | DELETE | `/api/v3/documents/{doc-public-id}/epics/{epic-public-id}` | [Unlink Document from Epic](https://developer.shortcut.com/api/rest/v3#Unlink-Document-from-Epic) |
| `listEntityTemplates.get` | GET | `/api/v3/entity-templates` | [List Entity Templates](https://developer.shortcut.com/api/rest/v3#List-Entity-Templates) |
| `createEntityTemplate.post` | POST | `/api/v3/entity-templates` | [Create Entity Template](https://developer.shortcut.com/api/rest/v3#Create-Entity-Template) |
| `disableStoryTemplates.put` | PUT | `/api/v3/entity-templates/disable` | [Disable Story Templates](https://developer.shortcut.com/api/rest/v3#Disable-Story-Templates) |
| `enableStoryTemplates.put` | PUT | `/api/v3/entity-templates/enable` | [Enable Story Templates](https://developer.shortcut.com/api/rest/v3#Enable-Story-Templates) |
| `getEntityTemplate.get` | GET | `/api/v3/entity-templates/{entity-template-public-id}` | [Get Entity Template](https://developer.shortcut.com/api/rest/v3#Get-Entity-Template) |
| `updateEntityTemplate.put` | PUT | `/api/v3/entity-templates/{entity-template-public-id}` | [Update Entity Template](https://developer.shortcut.com/api/rest/v3#Update-Entity-Template) |
| `deleteEntityTemplate.delete` | DELETE | `/api/v3/entity-templates/{entity-template-public-id}` | [Delete Entity Template](https://developer.shortcut.com/api/rest/v3#Delete-Entity-Template) |
| `getEpicWorkflow.get` | GET | `/api/v3/epic-workflow` | [Get Epic Workflow](https://developer.shortcut.com/api/rest/v3#Get-Epic-Workflow) |
| `listEpics.get` | GET | `/api/v3/epics` | [List Epics](https://developer.shortcut.com/api/rest/v3#List-Epics) |
| `createEpic.post` | POST | `/api/v3/epics` | [Create Epic](https://developer.shortcut.com/api/rest/v3#Create-Epic) |
| `listEpicsPaginated.get` | GET | `/api/v3/epics/paginated` | [List Epics Paginated](https://developer.shortcut.com/api/rest/v3#List-Epics-Paginated) |
| `getEpic.get` | GET | `/api/v3/epics/{epic-public-id}` | [Get Epic](https://developer.shortcut.com/api/rest/v3#Get-Epic) |
| `updateEpic.put` | PUT | `/api/v3/epics/{epic-public-id}` | [Update Epic](https://developer.shortcut.com/api/rest/v3#Update-Epic) |
| `deleteEpic.delete` | DELETE | `/api/v3/epics/{epic-public-id}` | [Delete Epic](https://developer.shortcut.com/api/rest/v3#Delete-Epic) |
| `listEpicComments.get` | GET | `/api/v3/epics/{epic-public-id}/comments` | [List Epic Comments](https://developer.shortcut.com/api/rest/v3#List-Epic-Comments) |
| `createEpicComment.post` | POST | `/api/v3/epics/{epic-public-id}/comments` | [Create Epic Comment](https://developer.shortcut.com/api/rest/v3#Create-Epic-Comment) |
| `createEpicCommentComment.post` | POST | `/api/v3/epics/{epic-public-id}/comments/{comment-public-id}` | [Create Epic Comment Comment](https://developer.shortcut.com/api/rest/v3#Create-Epic-Comment-Comment) |
| `getEpicComment.get` | GET | `/api/v3/epics/{epic-public-id}/comments/{comment-public-id}` | [Get Epic Comment](https://developer.shortcut.com/api/rest/v3#Get-Epic-Comment) |
| `updateEpicComment.put` | PUT | `/api/v3/epics/{epic-public-id}/comments/{comment-public-id}` | [Update Epic Comment](https://developer.shortcut.com/api/rest/v3#Update-Epic-Comment) |
| `deleteEpicComment.delete` | DELETE | `/api/v3/epics/{epic-public-id}/comments/{comment-public-id}` | [Delete Epic Comment](https://developer.shortcut.com/api/rest/v3#Delete-Epic-Comment) |
| `listEpicDocuments.get` | GET | `/api/v3/epics/{epic-public-id}/documents` | [List Epic Documents](https://developer.shortcut.com/api/rest/v3#List-Epic-Documents) |
| `getEpicHealth.get` | GET | `/api/v3/epics/{epic-public-id}/health` | [Get Epic Health](https://developer.shortcut.com/api/rest/v3#Get-Epic-Health) |
| `createEpicHealth.post` | POST | `/api/v3/epics/{epic-public-id}/health` | [Create Epic Health](https://developer.shortcut.com/api/rest/v3#Create-Epic-Health) |
| `listEpicHealths.get` | GET | `/api/v3/epics/{epic-public-id}/health-history` | [List Epic Healths](https://developer.shortcut.com/api/rest/v3#List-Epic-Healths) |
| `listEpicStories.get` | GET | `/api/v3/epics/{epic-public-id}/stories` | [List Epic Stories](https://developer.shortcut.com/api/rest/v3#List-Epic-Stories) |
| `getExternalLinkStories.get` | GET | `/api/v3/external-link/stories` | [Get External Link Stories](https://developer.shortcut.com/api/rest/v3#Get-External-Link-Stories) |
| `listFiles.get` | GET | `/api/v3/files` | [List Files](https://developer.shortcut.com/api/rest/v3#List-Files) |
| `uploadFiles.post` | POST | `/api/v3/files` | [Upload Files](https://developer.shortcut.com/api/rest/v3#Upload-Files) |
| `getFile.get` | GET | `/api/v3/files/{file-public-id}` | [Get File](https://developer.shortcut.com/api/rest/v3#Get-File) |
| `updateFile.put` | PUT | `/api/v3/files/{file-public-id}` | [Update File](https://developer.shortcut.com/api/rest/v3#Update-File) |
| `deleteFile.delete` | DELETE | `/api/v3/files/{file-public-id}` | [Delete File](https://developer.shortcut.com/api/rest/v3#Delete-File) |
| `listGroups.get` | GET | `/api/v3/groups` | [List Groups](https://developer.shortcut.com/api/rest/v3#List-Groups) |
| `createGroup.post` | POST | `/api/v3/groups` | [Create Group](https://developer.shortcut.com/api/rest/v3#Create-Group) |
| `getGroup.get` | GET | `/api/v3/groups/{group-public-id}` | [Get Group](https://developer.shortcut.com/api/rest/v3#Get-Group) |
| `updateGroup.put` | PUT | `/api/v3/groups/{group-public-id}` | [Update Group](https://developer.shortcut.com/api/rest/v3#Update-Group) |
| `listGroupStories.get` | GET | `/api/v3/groups/{group-public-id}/stories` | [List Group Stories](https://developer.shortcut.com/api/rest/v3#List-Group-Stories) |
| `updateHealth.put` | PUT | `/api/v3/health/{health-public-id}` | [Update Health](https://developer.shortcut.com/api/rest/v3#Update-Health) |
| `listIterations.get` | GET | `/api/v3/iterations` | [List Iterations](https://developer.shortcut.com/api/rest/v3#List-Iterations) |
| `createIteration.post` | POST | `/api/v3/iterations` | [Create Iteration](https://developer.shortcut.com/api/rest/v3#Create-Iteration) |
| `disableIterations.put` | PUT | `/api/v3/iterations/disable` | [Disable Iterations](https://developer.shortcut.com/api/rest/v3#Disable-Iterations) |
| `enableIterations.put` | PUT | `/api/v3/iterations/enable` | [Enable Iterations](https://developer.shortcut.com/api/rest/v3#Enable-Iterations) |
| `getIteration.get` | GET | `/api/v3/iterations/{iteration-public-id}` | [Get Iteration](https://developer.shortcut.com/api/rest/v3#Get-Iteration) |
| `updateIteration.put` | PUT | `/api/v3/iterations/{iteration-public-id}` | [Update Iteration](https://developer.shortcut.com/api/rest/v3#Update-Iteration) |
| `deleteIteration.delete` | DELETE | `/api/v3/iterations/{iteration-public-id}` | [Delete Iteration](https://developer.shortcut.com/api/rest/v3#Delete-Iteration) |
| `listIterationStories.get` | GET | `/api/v3/iterations/{iteration-public-id}/stories` | [List Iteration Stories](https://developer.shortcut.com/api/rest/v3#List-Iteration-Stories) |
| `getKeyResult.get` | GET | `/api/v3/key-results/{key-result-public-id}` | [Get Key Result](https://developer.shortcut.com/api/rest/v3#Get-Key-Result) |
| `updateKeyResult.put` | PUT | `/api/v3/key-results/{key-result-public-id}` | [Update Key Result](https://developer.shortcut.com/api/rest/v3#Update-Key-Result) |
| `listLabels.get` | GET | `/api/v3/labels` | [List Labels](https://developer.shortcut.com/api/rest/v3#List-Labels) |
| `createLabel.post` | POST | `/api/v3/labels` | [Create Label](https://developer.shortcut.com/api/rest/v3#Create-Label) |
| `getLabel.get` | GET | `/api/v3/labels/{label-public-id}` | [Get Label](https://developer.shortcut.com/api/rest/v3#Get-Label) |
| `updateLabel.put` | PUT | `/api/v3/labels/{label-public-id}` | [Update Label](https://developer.shortcut.com/api/rest/v3#Update-Label) |
| `deleteLabel.delete` | DELETE | `/api/v3/labels/{label-public-id}` | [Delete Label](https://developer.shortcut.com/api/rest/v3#Delete-Label) |
| `listLabelEpics.get` | GET | `/api/v3/labels/{label-public-id}/epics` | [List Label Epics](https://developer.shortcut.com/api/rest/v3#List-Label-Epics) |
| `listLabelStories.get` | GET | `/api/v3/labels/{label-public-id}/stories` | [List Label Stories](https://developer.shortcut.com/api/rest/v3#List-Label-Stories) |
| `listLinkedFiles.get` | GET | `/api/v3/linked-files` | [List Linked Files](https://developer.shortcut.com/api/rest/v3#List-Linked-Files) |
| `createLinkedFile.post` | POST | `/api/v3/linked-files` | [Create Linked File](https://developer.shortcut.com/api/rest/v3#Create-Linked-File) |
| `getLinkedFile.get` | GET | `/api/v3/linked-files/{linked-file-public-id}` | [Get Linked File](https://developer.shortcut.com/api/rest/v3#Get-Linked-File) |
| `updateLinkedFile.put` | PUT | `/api/v3/linked-files/{linked-file-public-id}` | [Update Linked File](https://developer.shortcut.com/api/rest/v3#Update-Linked-File) |
| `deleteLinkedFile.delete` | DELETE | `/api/v3/linked-files/{linked-file-public-id}` | [Delete Linked File](https://developer.shortcut.com/api/rest/v3#Delete-Linked-File) |
| `getCurrentMemberInfo.get` | GET | `/api/v3/member` | [Get Current Member Info](https://developer.shortcut.com/api/rest/v3#Get-Current-Member-Info) |
| `listMembers.get` | GET | `/api/v3/members` | [List Members](https://developer.shortcut.com/api/rest/v3#List-Members) |
| `getMember.get` | GET | `/api/v3/members/{member-public-id}` | [Get Member](https://developer.shortcut.com/api/rest/v3#Get-Member) |
| `listMilestones.get` | GET | `/api/v3/milestones` | [List Milestones](https://developer.shortcut.com/api/rest/v3#List-Milestones) |
| `createMilestone.post` | POST | `/api/v3/milestones` | [Create Milestone](https://developer.shortcut.com/api/rest/v3#Create-Milestone) |
| `getMilestone.get` | GET | `/api/v3/milestones/{milestone-public-id}` | [Get Milestone](https://developer.shortcut.com/api/rest/v3#Get-Milestone) |
| `updateMilestone.put` | PUT | `/api/v3/milestones/{milestone-public-id}` | [Update Milestone](https://developer.shortcut.com/api/rest/v3#Update-Milestone) |
| `deleteMilestone.delete` | DELETE | `/api/v3/milestones/{milestone-public-id}` | [Delete Milestone](https://developer.shortcut.com/api/rest/v3#Delete-Milestone) |
| `listMilestoneEpics.get` | GET | `/api/v3/milestones/{milestone-public-id}/epics` | [List Milestone Epics](https://developer.shortcut.com/api/rest/v3#List-Milestone-Epics) |
| `listObjectives.get` | GET | `/api/v3/objectives` | [List Objectives](https://developer.shortcut.com/api/rest/v3#List-Objectives) |
| `createObjective.post` | POST | `/api/v3/objectives` | [Create Objective](https://developer.shortcut.com/api/rest/v3#Create-Objective) |
| `getObjective.get` | GET | `/api/v3/objectives/{objective-public-id}` | [Get Objective](https://developer.shortcut.com/api/rest/v3#Get-Objective) |
| `updateObjective.put` | PUT | `/api/v3/objectives/{objective-public-id}` | [Update Objective](https://developer.shortcut.com/api/rest/v3#Update-Objective) |
| `deleteObjective.delete` | DELETE | `/api/v3/objectives/{objective-public-id}` | [Delete Objective](https://developer.shortcut.com/api/rest/v3#Delete-Objective) |
| `listObjectiveEpics.get` | GET | `/api/v3/objectives/{objective-public-id}/epics` | [List Objective Epics](https://developer.shortcut.com/api/rest/v3#List-Objective-Epics) |
| `getObjectiveHealth.get` | GET | `/api/v3/objectives/{objective-public-id}/health` | [Get Objective Health](https://developer.shortcut.com/api/rest/v3#Get-Objective-Health) |
| `createObjectiveHealth.post` | POST | `/api/v3/objectives/{objective-public-id}/health` | [Create Objective Health](https://developer.shortcut.com/api/rest/v3#Create-Objective-Health) |
| `listObjectiveHealths.get` | GET | `/api/v3/objectives/{objective-public-id}/health-history` | [List Objective Healths](https://developer.shortcut.com/api/rest/v3#List-Objective-Healths) |
| `listProjects.get` | GET | `/api/v3/projects` | [List Projects](https://developer.shortcut.com/api/rest/v3#List-Projects) |
| `createProject.post` | POST | `/api/v3/projects` | [Create Project](https://developer.shortcut.com/api/rest/v3#Create-Project) |
| `getProject.get` | GET | `/api/v3/projects/{project-public-id}` | [Get Project](https://developer.shortcut.com/api/rest/v3#Get-Project) |
| `updateProject.put` | PUT | `/api/v3/projects/{project-public-id}` | [Update Project](https://developer.shortcut.com/api/rest/v3#Update-Project) |
| `deleteProject.delete` | DELETE | `/api/v3/projects/{project-public-id}` | [Delete Project](https://developer.shortcut.com/api/rest/v3#Delete-Project) |
| `listStories.get` | GET | `/api/v3/projects/{project-public-id}/stories` | [List Stories](https://developer.shortcut.com/api/rest/v3#List-Stories) |
| `listRepositories.get` | GET | `/api/v3/repositories` | [List Repositories](https://developer.shortcut.com/api/rest/v3#List-Repositories) |
| `getRepository.get` | GET | `/api/v3/repositories/{repo-public-id}` | [Get Repository](https://developer.shortcut.com/api/rest/v3#Get-Repository) |
| `search.get` | GET | `/api/v3/search` | [Search](https://developer.shortcut.com/api/rest/v3#Search) |
| `searchDocuments.get` | GET | `/api/v3/search/documents` | [Search Documents](https://developer.shortcut.com/api/rest/v3#Search-Documents) |
| `searchEpics.get` | GET | `/api/v3/search/epics` | [Search Epics](https://developer.shortcut.com/api/rest/v3#Search-Epics) |
| `searchIterations.get` | GET | `/api/v3/search/iterations` | [Search Iterations](https://developer.shortcut.com/api/rest/v3#Search-Iterations) |
| `searchMilestones.get` | GET | `/api/v3/search/milestones` | [Search Milestones](https://developer.shortcut.com/api/rest/v3#Search-Milestones) |
| `searchObjectives.get` | GET | `/api/v3/search/objectives` | [Search Objectives](https://developer.shortcut.com/api/rest/v3#Search-Objectives) |
| `searchStories.get` | GET | `/api/v3/search/stories` | [Search Stories](https://developer.shortcut.com/api/rest/v3#Search-Stories) |
| `createStory.post` | POST | `/api/v3/stories` | [Create Story](https://developer.shortcut.com/api/rest/v3#Create-Story) |
| `createMultipleStories.post` | POST | `/api/v3/stories/bulk` | [Create Multiple Stories](https://developer.shortcut.com/api/rest/v3#Create-Multiple-Stories) |
| `updateMultipleStories.put` | PUT | `/api/v3/stories/bulk` | [Update Multiple Stories](https://developer.shortcut.com/api/rest/v3#Update-Multiple-Stories) |
| `deleteMultipleStories.delete` | DELETE | `/api/v3/stories/bulk` | [Delete Multiple Stories](https://developer.shortcut.com/api/rest/v3#Delete-Multiple-Stories) |
| `createStoryFromTemplate.post` | POST | `/api/v3/stories/from-template` | [Create Story From Template](https://developer.shortcut.com/api/rest/v3#Create-Story-From-Template) |
| `queryStories.post` | POST | `/api/v3/stories/search` | [Query Stories](https://developer.shortcut.com/api/rest/v3#Query-Stories) |
| `getStory.get` | GET | `/api/v3/stories/{story-public-id}` | [Get Story](https://developer.shortcut.com/api/rest/v3#Get-Story) |
| `updateStory.put` | PUT | `/api/v3/stories/{story-public-id}` | [Update Story](https://developer.shortcut.com/api/rest/v3#Update-Story) |
| `deleteStory.delete` | DELETE | `/api/v3/stories/{story-public-id}` | [Delete Story](https://developer.shortcut.com/api/rest/v3#Delete-Story) |
| `listStoryComment.get` | GET | `/api/v3/stories/{story-public-id}/comments` | [List Story Comment](https://developer.shortcut.com/api/rest/v3#List-Story-Comment) |
| `createStoryComment.post` | POST | `/api/v3/stories/{story-public-id}/comments` | [Create Story Comment](https://developer.shortcut.com/api/rest/v3#Create-Story-Comment) |
| `getStoryComment.get` | GET | `/api/v3/stories/{story-public-id}/comments/{comment-public-id}` | [Get Story Comment](https://developer.shortcut.com/api/rest/v3#Get-Story-Comment) |
| `updateStoryComment.put` | PUT | `/api/v3/stories/{story-public-id}/comments/{comment-public-id}` | [Update Story Comment](https://developer.shortcut.com/api/rest/v3#Update-Story-Comment) |
| `deleteStoryComment.delete` | DELETE | `/api/v3/stories/{story-public-id}/comments/{comment-public-id}` | [Delete Story Comment](https://developer.shortcut.com/api/rest/v3#Delete-Story-Comment) |
| `createStoryReaction.post` | POST | `/api/v3/stories/{story-public-id}/comments/{comment-public-id}/reactions` | [Create Story Reaction](https://developer.shortcut.com/api/rest/v3#Create-Story-Reaction) |
| `deleteStoryReaction.delete` | DELETE | `/api/v3/stories/{story-public-id}/comments/{comment-public-id}/reactions` | [Delete Story Reaction](https://developer.shortcut.com/api/rest/v3#Delete-Story-Reaction) |
| `unlinkCommentThreadFromSlack.post` | POST | `/api/v3/stories/{story-public-id}/comments/{comment-public-id}/unlink-from-slack` | [Unlink Comment thread from Slack](https://developer.shortcut.com/api/rest/v3#Unlink-Comment-thread-from-Slack) |
| `storyHistory.get` | GET | `/api/v3/stories/{story-public-id}/history` | [Story History](https://developer.shortcut.com/api/rest/v3#Story-History) |
| `listStorySubTasks.get` | GET | `/api/v3/stories/{story-public-id}/sub-tasks` | [List Story Sub tasks](https://developer.shortcut.com/api/rest/v3#List-Story-Sub-tasks) |
| `createTask.post` | POST | `/api/v3/stories/{story-public-id}/tasks` | [Create Task](https://developer.shortcut.com/api/rest/v3#Create-Task) |
| `getTask.get` | GET | `/api/v3/stories/{story-public-id}/tasks/{task-public-id}` | [Get Task](https://developer.shortcut.com/api/rest/v3#Get-Task) |
| `updateTask.put` | PUT | `/api/v3/stories/{story-public-id}/tasks/{task-public-id}` | [Update Task](https://developer.shortcut.com/api/rest/v3#Update-Task) |
| `deleteTask.delete` | DELETE | `/api/v3/stories/{story-public-id}/tasks/{task-public-id}` | [Delete Task](https://developer.shortcut.com/api/rest/v3#Delete-Task) |
| `createStoryLink.post` | POST | `/api/v3/story-links` | [Create Story Link](https://developer.shortcut.com/api/rest/v3#Create-Story-Link) |
| `getStoryLink.get` | GET | `/api/v3/story-links/{story-link-public-id}` | [Get Story Link](https://developer.shortcut.com/api/rest/v3#Get-Story-Link) |
| `updateStoryLink.put` | PUT | `/api/v3/story-links/{story-link-public-id}` | [Update Story Link](https://developer.shortcut.com/api/rest/v3#Update-Story-Link) |
| `deleteStoryLink.delete` | DELETE | `/api/v3/story-links/{story-link-public-id}` | [Delete Story Link](https://developer.shortcut.com/api/rest/v3#Delete-Story-Link) |
| `listWorkflows.get` | GET | `/api/v3/workflows` | [List Workflows](https://developer.shortcut.com/api/rest/v3#List-Workflows) |
| `getWorkflow.get` | GET | `/api/v3/workflows/{workflow-public-id}` | [Get Workflow](https://developer.shortcut.com/api/rest/v3#Get-Workflow) |

## Pagination and rate limits

Pagination and filtering parameters are exposed exactly where the OpenAPI specification documents them (including `page`/`page_size`, `limit`/`offset`, and continuation `next` values). Routes without pagination parameters in the v3 specification are not assigned invented pagination. The shared HTTP transport honors `Retry-After` for 429 responses; 5xx and network retries are limited to GET operations to avoid replaying writes.

## Scope exclusions

- Shortcut REST v3 webhook-integration management (`POST /api/v3/integrations/webhook`, `GET /api/v3/integrations/webhook/{integration-public-id}`, and `DELETE` on the same item route) is excluded: the requested scope excludes webhook management/receivers.
- The separate Shortcut Webhook API v1 and inbound webhook receivers are excluded; no callback, signature, or webhook-secret inputs are exposed.
- REST v3 file upload is included via multipart form data, which the Corsair transport supports.

## Source

Endpoint inventory, parameters, and schemas are derived from [Shortcut REST API v3](https://developer.shortcut.com/api/rest/v3) and its [official OpenAPI 3.0 document](https://developer.shortcut.com/api/rest/v3/shortcut.openapi.json).
