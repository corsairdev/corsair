import { table, t } from "../db";

export const users = table(
  "users",
  {
    id: t.uuid().primaryKey(),
    name: t.text(),
  },
  {
    access: {
      create: "logged in users",
      update: "themselves",
      delete: "themselves",
    },
    constraints: ["name must be unique"],
  }
);

export const posts = table(
  "posts",
  {
    id: t.uuid().primaryKey(),
    title: t.text(),
    content: t.text(),
    author_id: t.uuid().references(() => users.id),
  },
  {
    access: {
      create: "logged in users",
      update: "author",
      delete: "author",
    },
    constraints: ["title must be unique"],
  }
);
