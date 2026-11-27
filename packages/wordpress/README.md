# @corsair-dev/wordpress

WordPress integration for Corsair: self-hosted WordPress sites (and WordPress.com sites with application passwords): posts, pages, media uploads, revisions and autosaves, categories, tags and custom taxonomies, comments, users and application passwords, site settings, plugins (install, activate, delete), themes, block templates and template parts, global styles, navigation and classic menus, widgets and sidebars, block types, patterns and fonts, search, Site Health checks, the Abilities API, batch requests and any custom post type or plugin route (209 operations).

## Install

```bash
pnpm add @corsair-dev/wordpress
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `abilities.categories.get` | `wordpress.api.abilities.categories.get` | `read` | Get one ability category |
| `abilities.categories.list` | `wordpress.api.abilities.categories.list` | `read` | List the ability categories |
| `abilities.get` | `wordpress.api.abilities.get` | `read` | Get one registered ability with its input and output schema |
| `abilities.list` | `wordpress.api.abilities.list` | `read` | List the abilities registered on the site (the Abilities API): name, label, input and output schema and annotations |
| `abilities.run` | `wordpress.api.abilities.run` | `destructive` | Run an ability that changes something (sent as POST with its input); what it does depends on the ability |
| `abilities.runDestructive` | `wordpress.api.abilities.runDestructive` | `destructive` | Run an ability marked destructive (sent as DELETE) |
| `abilities.runReadonly` | `wordpress.api.abilities.runReadonly` | `read` | Run an ability marked readonly (sent as GET with its input) |
| `batch.run` | `wordpress.api.batch.run` | `destructive` | Run up to 25 write requests (POST, PUT, PATCH, DELETE on routes that allow batching) in one call; with validation require-all-validate nothing runs unless every request validates |
| `blockDirectory.search` | `wordpress.api.blockDirectory.search` | `read` | Search the WordPress.org block directory for installable block plugins |
| `blockEditor.export` | `wordpress.api.blockEditor.export` | `read` | Export the active block theme with the site's customizations as a zip (returned as a file) |
| `blockEditor.navigationFallback` | `wordpress.api.blockEditor.navigationFallback` | `write` | Get (or create) the navigation menu the editor falls back to when a Navigation block has none |
| `blockEditor.urlDetails` | `wordpress.api.blockEditor.urlDetails` | `read` | Fetch a URL's title, description, icon and image, as the editor's link previews do |
| `blockPatterns.categories` | `wordpress.api.blockPatterns.categories` | `read` | List the registered block pattern categories |
| `blockPatterns.list` | `wordpress.api.blockPatterns.list` | `read` | List the block patterns registered on the site (theme, core and plugin patterns) |
| `blockRenderer.render` | `wordpress.api.blockRenderer.render` | `read` | Render a dynamic block (a server-side rendered block such as core/latest-posts) with attributes to HTML |
| `blocks.autosaves.create` | `wordpress.api.blocks.autosaves.create` | `write` | Create a autosave for a synced pattern (reusable block) |
| `blocks.autosaves.get` | `wordpress.api.blocks.autosaves.get` | `read` | Get one autosave of a synced pattern (reusable block) |
| `blocks.autosaves.list` | `wordpress.api.blocks.autosaves.list` | `read` | List the autosaves of a synced pattern (reusable block) |
| `blocks.create` | `wordpress.api.blocks.create` | `write` | Create a synced pattern (reusable block) |
| `blocks.delete` | `wordpress.api.blocks.delete` | `destructive` | Delete a synced pattern (reusable block); without force true it goes to the trash |
| `blocks.get` | `wordpress.api.blocks.get` | `read` | Get one synced pattern (reusable block) |
| `blocks.list` | `wordpress.api.blocks.list` | `read` | List synced patterns (reusable blocks), one page at a time, with search and filters |
| `blocks.revisions.delete` | `wordpress.api.blocks.revisions.delete` | `destructive` | Delete a revision; WordPress needs force true for this type, which deletes it permanently |
| `blocks.revisions.get` | `wordpress.api.blocks.revisions.get` | `read` | Get one revision of a synced pattern (reusable block) |
| `blocks.revisions.list` | `wordpress.api.blocks.revisions.list` | `read` | List the revisions of a synced pattern (reusable block), one page at a time, with search and filters |
| `blocks.update` | `wordpress.api.blocks.update` | `write` | Update a synced pattern (reusable block): only the fields you pass change |
| `blockTypes.get` | `wordpress.api.blockTypes.get` | `read` | Get one block type |
| `blockTypes.list` | `wordpress.api.blockTypes.list` | `read` | List block types |
| `blockTypes.listByNamespace` | `wordpress.api.blockTypes.listByNamespace` | `read` | List the registered block types in one namespace (for example `core`) |
| `categories.create` | `wordpress.api.categories.create` | `write` | Create a category |
| `categories.delete` | `wordpress.api.categories.delete` | `destructive` | Delete a category; WordPress needs force true for this type, which deletes it permanently |
| `categories.get` | `wordpress.api.categories.get` | `read` | Get one category |
| `categories.list` | `wordpress.api.categories.list` | `read` | List categories, one page at a time, with search and filters |
| `categories.update` | `wordpress.api.categories.update` | `write` | Update a category: only the fields you pass change |
| `comments.create` | `wordpress.api.comments.create` | `write` | Create a comment |
| `comments.delete` | `wordpress.api.comments.delete` | `destructive` | Delete a comment; without force true it goes to the trash |
| `comments.get` | `wordpress.api.comments.get` | `read` | Get one comment |
| `comments.list` | `wordpress.api.comments.list` | `read` | List comments, one page at a time, with search and filters |
| `comments.update` | `wordpress.api.comments.update` | `write` | Update a comment: only the fields you pass change |
| `fontCollections.get` | `wordpress.api.fontCollections.get` | `read` | Get one font collection |
| `fontCollections.list` | `wordpress.api.fontCollections.list` | `read` | List font collections, one page at a time |
| `fontFamilies.create` | `wordpress.api.fontFamilies.create` | `write` | Create a font family |
| `fontFamilies.delete` | `wordpress.api.fontFamilies.delete` | `destructive` | Delete a font family; WordPress needs force true for this type, which deletes it permanently |
| `fontFamilies.fontFaces.create` | `wordpress.api.fontFamilies.fontFaces.create` | `write` | Create a font face for a font family |
| `fontFamilies.fontFaces.delete` | `wordpress.api.fontFamilies.fontFaces.delete` | `destructive` | Delete a font face; WordPress needs force true for this type, which deletes it permanently |
| `fontFamilies.fontFaces.get` | `wordpress.api.fontFamilies.fontFaces.get` | `read` | Get one font face of a font family |
| `fontFamilies.fontFaces.list` | `wordpress.api.fontFamilies.fontFaces.list` | `read` | List the font faces of a font family, one page at a time |
| `fontFamilies.get` | `wordpress.api.fontFamilies.get` | `read` | Get one font family |
| `fontFamilies.list` | `wordpress.api.fontFamilies.list` | `read` | List font families, one page at a time |
| `fontFamilies.update` | `wordpress.api.fontFamilies.update` | `write` | Update a font family: only the fields you pass change |
| `globalStyles.get` | `wordpress.api.globalStyles.get` | `read` | Get one global styles record |
| `globalStyles.revisions.get` | `wordpress.api.globalStyles.revisions.get` | `read` | Get one revision of a global styles record |
| `globalStyles.revisions.list` | `wordpress.api.globalStyles.revisions.list` | `read` | List the revisions of a global styles record, one page at a time |
| `globalStyles.theme` | `wordpress.api.globalStyles.theme` | `read` | Get the active theme's base global styles (theme.json settings and styles) |
| `globalStyles.themeVariations` | `wordpress.api.globalStyles.themeVariations` | `read` | List a theme's style variations |
| `globalStyles.update` | `wordpress.api.globalStyles.update` | `write` | Update a global styles record: only the fields you pass change |
| `iconCollections.get` | `wordpress.api.iconCollections.get` | `read` | Get one icon collection |
| `iconCollections.list` | `wordpress.api.iconCollections.list` | `read` | List icon collections, one page at a time, with search and filters |
| `icons.get` | `wordpress.api.icons.get` | `read` | Get one icon |
| `icons.list` | `wordpress.api.icons.list` | `read` | List icons, one page at a time, with search and filters |
| `icons.listByCollection` | `wordpress.api.icons.listByCollection` | `read` | List the icons in one icon collection |
| `media.create` | `wordpress.api.media.create` | `write` | Upload a file to the media library (image, PDF, audio, video) with optional title, caption, alt text and the post it belongs to |
| `media.delete` | `wordpress.api.media.delete` | `destructive` | Delete a media item; WordPress needs force true for this type, which deletes it permanently |
| `media.edit` | `wordpress.api.media.edit` | `write` | Crop, rotate or flip an image attachment; WordPress saves the result as a new attachment |
| `media.finalize` | `wordpress.api.media.finalize` | `write` | Finish an attachment after its client-side image processing: WordPress writes the attachment's metadata |
| `media.get` | `wordpress.api.media.get` | `read` | Get one media item |
| `media.list` | `wordpress.api.media.list` | `read` | List media items, one page at a time, with search and filters |
| `media.postProcess` | `wordpress.api.media.postProcess` | `write` | Run server-side image processing (sub-size generation) for an uploaded attachment that is waiting for it |
| `media.sideload` | `wordpress.api.media.sideload` | `write` | Add a file as an extra image size of an existing attachment (the block editor's client-side image processing) |
| `media.update` | `wordpress.api.media.update` | `write` | Update a media item: only the fields you pass change |
| `menuItems.autosaves.create` | `wordpress.api.menuItems.autosaves.create` | `write` | Create a autosave for a menu item |
| `menuItems.autosaves.get` | `wordpress.api.menuItems.autosaves.get` | `read` | Get one autosave of a menu item |
| `menuItems.autosaves.list` | `wordpress.api.menuItems.autosaves.list` | `read` | List the autosaves of a menu item |
| `menuItems.create` | `wordpress.api.menuItems.create` | `write` | Create a menu item |
| `menuItems.delete` | `wordpress.api.menuItems.delete` | `destructive` | Delete a menu item; without force true it goes to the trash |
| `menuItems.get` | `wordpress.api.menuItems.get` | `read` | Get one menu item |
| `menuItems.list` | `wordpress.api.menuItems.list` | `read` | List menu items, one page at a time, with search and filters |
| `menuItems.update` | `wordpress.api.menuItems.update` | `write` | Update a menu item: only the fields you pass change |
| `menuLocations.get` | `wordpress.api.menuLocations.get` | `read` | Get one menu location |
| `menuLocations.list` | `wordpress.api.menuLocations.list` | `read` | List menu locations |
| `menus.create` | `wordpress.api.menus.create` | `write` | Create a classic menu |
| `menus.delete` | `wordpress.api.menus.delete` | `destructive` | Delete a classic menu; WordPress needs force true for this type, which deletes it permanently |
| `menus.get` | `wordpress.api.menus.get` | `read` | Get one classic menu |
| `menus.list` | `wordpress.api.menus.list` | `read` | List classic menus, one page at a time, with search and filters |
| `menus.update` | `wordpress.api.menus.update` | `write` | Update a classic menu: only the fields you pass change |
| `navigation.autosaves.create` | `wordpress.api.navigation.autosaves.create` | `write` | Create a autosave for a navigation menu |
| `navigation.autosaves.get` | `wordpress.api.navigation.autosaves.get` | `read` | Get one autosave of a navigation menu |
| `navigation.autosaves.list` | `wordpress.api.navigation.autosaves.list` | `read` | List the autosaves of a navigation menu |
| `navigation.create` | `wordpress.api.navigation.create` | `write` | Create a navigation menu |
| `navigation.delete` | `wordpress.api.navigation.delete` | `destructive` | Delete a navigation menu; without force true it goes to the trash |
| `navigation.get` | `wordpress.api.navigation.get` | `read` | Get one navigation menu |
| `navigation.list` | `wordpress.api.navigation.list` | `read` | List navigation menus, one page at a time, with search and filters |
| `navigation.revisions.delete` | `wordpress.api.navigation.revisions.delete` | `destructive` | Delete a revision; WordPress needs force true for this type, which deletes it permanently |
| `navigation.revisions.get` | `wordpress.api.navigation.revisions.get` | `read` | Get one revision of a navigation menu |
| `navigation.revisions.list` | `wordpress.api.navigation.revisions.list` | `read` | List the revisions of a navigation menu, one page at a time, with search and filters |
| `navigation.update` | `wordpress.api.navigation.update` | `write` | Update a navigation menu: only the fields you pass change |
| `oembed.embed` | `wordpress.api.oembed.embed` | `read` | Get the oEmbed data (title, author, HTML embed code) for a URL on this site |
| `oembed.proxy` | `wordpress.api.oembed.proxy` | `read` | Get oEmbed data for a URL on another site (YouTube, X, Vimeo ...) through the site, as the block editor does |
| `pages.autosaves.create` | `wordpress.api.pages.autosaves.create` | `write` | Create a autosave for a page |
| `pages.autosaves.get` | `wordpress.api.pages.autosaves.get` | `read` | Get one autosave of a page |
| `pages.autosaves.list` | `wordpress.api.pages.autosaves.list` | `read` | List the autosaves of a page |
| `pages.create` | `wordpress.api.pages.create` | `write` | Create a page |
| `pages.delete` | `wordpress.api.pages.delete` | `destructive` | Delete a page; without force true it goes to the trash |
| `pages.get` | `wordpress.api.pages.get` | `read` | Get one page |
| `pages.list` | `wordpress.api.pages.list` | `read` | List pages, one page at a time, with search and filters |
| `pages.revisions.delete` | `wordpress.api.pages.revisions.delete` | `destructive` | Delete a revision; WordPress needs force true for this type, which deletes it permanently |
| `pages.revisions.get` | `wordpress.api.pages.revisions.get` | `read` | Get one revision of a page |
| `pages.revisions.list` | `wordpress.api.pages.revisions.list` | `read` | List the revisions of a page, one page at a time, with search and filters |
| `pages.update` | `wordpress.api.pages.update` | `write` | Update a page: only the fields you pass change |
| `patternCategories.create` | `wordpress.api.patternCategories.create` | `write` | Create a pattern category |
| `patternCategories.delete` | `wordpress.api.patternCategories.delete` | `destructive` | Delete a pattern category; WordPress needs force true for this type, which deletes it permanently |
| `patternCategories.get` | `wordpress.api.patternCategories.get` | `read` | Get one pattern category |
| `patternCategories.list` | `wordpress.api.patternCategories.list` | `read` | List pattern categories, one page at a time, with search and filters |
| `patternCategories.update` | `wordpress.api.patternCategories.update` | `write` | Update a pattern category: only the fields you pass change |
| `patternDirectory.search` | `wordpress.api.patternDirectory.search` | `read` | Search the WordPress.org pattern directory |
| `plugins.delete` | `wordpress.api.plugins.delete` | `destructive` | Delete an inactive plugin's files from the site |
| `plugins.get` | `wordpress.api.plugins.get` | `read` | Get one plugin |
| `plugins.install` | `wordpress.api.plugins.install` | `destructive` | Install a plugin from the WordPress.org directory by its slug, optionally activating it (runs third-party code on the site) |
| `plugins.list` | `wordpress.api.plugins.list` | `read` | List plugins |
| `plugins.update` | `wordpress.api.plugins.update` | `destructive` | Activate or deactivate an installed plugin (status active, inactive or network-active) |
| `posts.autosaves.create` | `wordpress.api.posts.autosaves.create` | `write` | Create a autosave for a post |
| `posts.autosaves.get` | `wordpress.api.posts.autosaves.get` | `read` | Get one autosave of a post |
| `posts.autosaves.list` | `wordpress.api.posts.autosaves.list` | `read` | List the autosaves of a post |
| `posts.create` | `wordpress.api.posts.create` | `write` | Create a post |
| `posts.delete` | `wordpress.api.posts.delete` | `destructive` | Delete a post; without force true it goes to the trash |
| `posts.get` | `wordpress.api.posts.get` | `read` | Get one post |
| `posts.list` | `wordpress.api.posts.list` | `read` | List posts, one page at a time, with search and filters |
| `posts.revisions.delete` | `wordpress.api.posts.revisions.delete` | `destructive` | Delete a revision; WordPress needs force true for this type, which deletes it permanently |
| `posts.revisions.get` | `wordpress.api.posts.revisions.get` | `read` | Get one revision of a post |
| `posts.revisions.list` | `wordpress.api.posts.revisions.list` | `read` | List the revisions of a post, one page at a time, with search and filters |
| `posts.update` | `wordpress.api.posts.update` | `write` | Update a post: only the fields you pass change |
| `rest.get` | `wordpress.api.rest.get` | `read` | GET any route on the site's REST API, such as a custom post type (`wp/v2/book`) or another plugin's namespace (`yoast/v1/...`, `acf/v3/...`); returns the JSON as is |
| `rest.send` | `wordpress.api.rest.send` | `destructive` | POST, PUT, PATCH or DELETE any route on the site's REST API (a custom post type, another plugin's route); returns the JSON as is |
| `search.query` | `wordpress.api.search.query` | `read` | Search posts, terms or post formats across types, one page at a time: title, URL, type and subtype of each match |
| `settings.get` | `wordpress.api.settings.get` | `read` | Get the site's settings: title, tagline, URL, admin email, timezone, date and time formats, language, posts per page, default category, comment settings and more |
| `settings.update` | `wordpress.api.settings.update` | `write` | Update site settings: only the settings you pass change |
| `sidebars.get` | `wordpress.api.sidebars.get` | `read` | Get one widget area (sidebar) |
| `sidebars.list` | `wordpress.api.sidebars.list` | `read` | List widget areas (sidebars) |
| `sidebars.update` | `wordpress.api.sidebars.update` | `write` | Update a widget area (sidebar): only the fields you pass change |
| `site.index` | `wordpress.api.site.index` | `read` | Get the site's REST discovery document: name, description, URL, timezone, the namespaces it serves (wp/v2, plugins' own) and every route with its methods and args |
| `siteHealth.authorizationHeader` | `wordpress.api.siteHealth.authorizationHeader` | `read` | Run the Site Health test that checks the Authorization header reaches WordPress |
| `siteHealth.backgroundUpdates` | `wordpress.api.siteHealth.backgroundUpdates` | `read` | Run the Site Health test that checks automatic background updates can work |
| `siteHealth.directorySizes` | `wordpress.api.siteHealth.directorySizes` | `read` | Get the size of the site's directories (WordPress, themes, plugins, uploads, database); can be slow on big sites |
| `siteHealth.dotorgCommunication` | `wordpress.api.siteHealth.dotorgCommunication` | `read` | Run the Site Health test that checks the site can reach WordPress.org |
| `siteHealth.httpsStatus` | `wordpress.api.siteHealth.httpsStatus` | `read` | Run the Site Health test that checks the site is served over HTTPS |
| `siteHealth.loopbackRequests` | `wordpress.api.siteHealth.loopbackRequests` | `read` | Run the Site Health test that checks the site can make loopback requests to itself |
| `siteHealth.pageCache` | `wordpress.api.siteHealth.pageCache` | `read` | Run the Site Health test that checks for a page cache and its response times |
| `statuses.get` | `wordpress.api.statuses.get` | `read` | Get one post status |
| `statuses.list` | `wordpress.api.statuses.list` | `read` | List post statuses |
| `tags.create` | `wordpress.api.tags.create` | `write` | Create a tag |
| `tags.delete` | `wordpress.api.tags.delete` | `destructive` | Delete a tag; WordPress needs force true for this type, which deletes it permanently |
| `tags.get` | `wordpress.api.tags.get` | `read` | Get one tag |
| `tags.list` | `wordpress.api.tags.list` | `read` | List tags, one page at a time, with search and filters |
| `tags.update` | `wordpress.api.tags.update` | `write` | Update a tag: only the fields you pass change |
| `taxonomies.get` | `wordpress.api.taxonomies.get` | `read` | Get one taxonomy |
| `taxonomies.list` | `wordpress.api.taxonomies.list` | `read` | List taxonomies |
| `templateParts.autosaves.create` | `wordpress.api.templateParts.autosaves.create` | `write` | Create a autosave for a template part |
| `templateParts.autosaves.get` | `wordpress.api.templateParts.autosaves.get` | `read` | Get one autosave of a template part |
| `templateParts.autosaves.list` | `wordpress.api.templateParts.autosaves.list` | `read` | List the autosaves of a template part |
| `templateParts.create` | `wordpress.api.templateParts.create` | `write` | Create a template part |
| `templateParts.delete` | `wordpress.api.templateParts.delete` | `destructive` | Delete a template part; without force true it goes to the trash |
| `templateParts.get` | `wordpress.api.templateParts.get` | `read` | Get one template part |
| `templateParts.list` | `wordpress.api.templateParts.list` | `read` | List template parts |
| `templateParts.lookup` | `wordpress.api.templateParts.lookup` | `read` | Find the fallback template part WordPress would use for a slug |
| `templateParts.revisions.delete` | `wordpress.api.templateParts.revisions.delete` | `destructive` | Delete a revision; WordPress needs force true for this type, which deletes it permanently |
| `templateParts.revisions.get` | `wordpress.api.templateParts.revisions.get` | `read` | Get one revision of a template part |
| `templateParts.revisions.list` | `wordpress.api.templateParts.revisions.list` | `read` | List the revisions of a template part, one page at a time, with search and filters |
| `templateParts.update` | `wordpress.api.templateParts.update` | `write` | Update a template part: only the fields you pass change |
| `templates.autosaves.create` | `wordpress.api.templates.autosaves.create` | `write` | Create a autosave for a block template |
| `templates.autosaves.get` | `wordpress.api.templates.autosaves.get` | `read` | Get one autosave of a block template |
| `templates.autosaves.list` | `wordpress.api.templates.autosaves.list` | `read` | List the autosaves of a block template |
| `templates.create` | `wordpress.api.templates.create` | `write` | Create a block template |
| `templates.delete` | `wordpress.api.templates.delete` | `destructive` | Delete a block template; without force true it goes to the trash |
| `templates.get` | `wordpress.api.templates.get` | `read` | Get one block template |
| `templates.list` | `wordpress.api.templates.list` | `read` | List block templates |
| `templates.lookup` | `wordpress.api.templates.lookup` | `read` | Find the fallback template WordPress would use for a slug (for example `single-post`), when the theme has none of its own |
| `templates.revisions.delete` | `wordpress.api.templates.revisions.delete` | `destructive` | Delete a revision; WordPress needs force true for this type, which deletes it permanently |
| `templates.revisions.get` | `wordpress.api.templates.revisions.get` | `read` | Get one revision of a block template |
| `templates.revisions.list` | `wordpress.api.templates.revisions.list` | `read` | List the revisions of a block template, one page at a time, with search and filters |
| `templates.update` | `wordpress.api.templates.update` | `write` | Update a block template: only the fields you pass change |
| `themes.get` | `wordpress.api.themes.get` | `read` | Get one theme |
| `themes.list` | `wordpress.api.themes.list` | `read` | List themes |
| `types.get` | `wordpress.api.types.get` | `read` | Get one post type |
| `types.list` | `wordpress.api.types.list` | `read` | List post types |
| `users.applicationPasswords.create` | `wordpress.api.users.applicationPasswords.create` | `destructive` | Create an application password for a user; the response's `password` is shown once and can act as that user |
| `users.applicationPasswords.delete` | `wordpress.api.users.applicationPasswords.delete` | `destructive` | Delete a application password |
| `users.applicationPasswords.deleteAll` | `wordpress.api.users.applicationPasswords.deleteAll` | `destructive` | Revoke every application password of a user, the one this call uses included |
| `users.applicationPasswords.get` | `wordpress.api.users.applicationPasswords.get` | `read` | Get one application password of a user |
| `users.applicationPasswords.introspect` | `wordpress.api.users.applicationPasswords.introspect` | `read` | Get the application password this call is made with (name, uuid, last used) |
| `users.applicationPasswords.list` | `wordpress.api.users.applicationPasswords.list` | `read` | List the application passwords of a user |
| `users.applicationPasswords.update` | `wordpress.api.users.applicationPasswords.update` | `write` | Update a application password: only the fields you pass change |
| `users.create` | `wordpress.api.users.create` | `write` | Create a user |
| `users.delete` | `wordpress.api.users.delete` | `destructive` | Delete a user; WordPress needs force true for this type, which deletes it permanently |
| `users.deleteMe` | `wordpress.api.users.deleteMe` | `destructive` | Delete the authenticated user's own account, reassigning their posts to another user (`reassign`, required with `force: true`) |
| `users.get` | `wordpress.api.users.get` | `read` | Get one user |
| `users.list` | `wordpress.api.users.list` | `read` | List users, one page at a time, with search and filters |
| `users.me` | `wordpress.api.users.me` | `read` | Get the user the application password belongs to: name, roles and (with context edit) email and capabilities |
| `users.update` | `wordpress.api.users.update` | `write` | Update a user: only the fields you pass change |
| `users.updateMe` | `wordpress.api.users.updateMe` | `write` | Update the authenticated user's own profile |
| `viewConfig.get` | `wordpress.api.viewConfig.get` | `read` | Get the data views configuration the admin screens use for an entity |
| `widgets.create` | `wordpress.api.widgets.create` | `write` | Create a widget |
| `widgets.delete` | `wordpress.api.widgets.delete` | `destructive` | Delete a widget; WordPress needs force true for this type, which deletes it permanently |
| `widgets.get` | `wordpress.api.widgets.get` | `read` | Get one widget |
| `widgets.list` | `wordpress.api.widgets.list` | `read` | List widgets |
| `widgets.update` | `wordpress.api.widgets.update` | `write` | Update a widget: only the fields you pass change |
| `widgetTypes.encode` | `wordpress.api.widgetTypes.encode` | `read` | Encode a legacy widget's form data into the instance a widget block stores |
| `widgetTypes.get` | `wordpress.api.widgetTypes.get` | `read` | Get one widget type |
| `widgetTypes.list` | `wordpress.api.widgetTypes.list` | `read` | List widget types |
| `widgetTypes.render` | `wordpress.api.widgetTypes.render` | `read` | Render a legacy widget instance to HTML |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/wordpress

## License

Apache-2.0
