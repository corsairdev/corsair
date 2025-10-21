import CorsairDB from "corsair/db/schema-builder";

export const users = CorsairDB.table(
  "users",
  {
    id: CorsairDB.uuid()
      .primaryKey()
      .default(CorsairDB.sql`uuid_generate_v4()`),
    name: CorsairDB.text(),
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

export const posts = CorsairDB.table(
  "posts",
  {
    id: CorsairDB.uuid().primaryKey(),
    title: CorsairDB.text(),
    content: CorsairDB.text(),
    author_id: CorsairDB.uuid().references(() => users.id),
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
