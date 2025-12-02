// @ts-nocheck
import { default as __fd_glob_11 } from "../content/docs/meta.json?collection=meta"
import * as __fd_glob_10 from "../content/docs/type-safety.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/quickstart.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/project-structure.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/plugins.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/overview.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/installation.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/index.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/examples.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/core-concepts.mdx?collection=docs"
import * as __fd_glob_1 from "../content/docs/cli.mdx?collection=docs"
import * as __fd_glob_0 from "../content/docs/adapters.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.doc("docs", "content/docs", {"adapters.mdx": __fd_glob_0, "cli.mdx": __fd_glob_1, "core-concepts.mdx": __fd_glob_2, "examples.mdx": __fd_glob_3, "index.mdx": __fd_glob_4, "installation.mdx": __fd_glob_5, "overview.mdx": __fd_glob_6, "plugins.mdx": __fd_glob_7, "project-structure.mdx": __fd_glob_8, "quickstart.mdx": __fd_glob_9, "type-safety.mdx": __fd_glob_10, });

export const meta = await create.meta("meta", "content/docs", {"meta.json": __fd_glob_11, });