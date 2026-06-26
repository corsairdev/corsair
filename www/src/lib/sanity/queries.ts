import { defineQuery } from 'next-sanity';

export const postFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  description,
  author,
  publishedAt,
  body
`;

export const allPostsQuery = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    ${postFields}
  }
`);

export const postBySlugQuery = defineQuery(/* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields}
  }
`);

export const allPostSlugsQuery = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`);
