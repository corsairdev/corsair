import {
  createCorsairQueryClient,
  createCorsairMutationClient,
  InferQueriesOutputs,
  InferQueriesInputs,
  InferMutationsOutputs,
  InferMutationsInputs,
} from "../../../core";
import { queries } from "./queries";
import { mutations } from "./mutations";

// Client-side hooks (for use in client components)
const queryClient = createCorsairQueryClient(queries);
const mutationClient = createCorsairMutationClient(mutations);

export const useBlogQuery = queryClient.useQuery;
export const useBlogMutation = mutationClient.useMutation;

// Type exports for inferred outputs and inputs
export type BlogQueryOutputs = InferQueriesOutputs<typeof queries>;
export type BlogQueryInputs = InferQueriesInputs<typeof queries>;
export type BlogMutationOutputs = InferMutationsOutputs<typeof mutations>;
export type BlogMutationInputs = InferMutationsInputs<typeof mutations>;

// Specific type exports for common use cases
export type GetAllAuthorsInput = BlogQueryInputs["get all authors"];
export type GetAllAuthorsOutput = BlogQueryOutputs["get all authors"];

export type GetAuthorByIdInput = BlogQueryInputs["get author by id"];
export type GetAuthorByIdOutput = BlogQueryOutputs["get author by id"];

export type GetAllPostsInput = BlogQueryInputs["get all posts"];
export type GetAllPostsOutput = BlogQueryOutputs["get all posts"];

export type GetPostBySlugInput = BlogQueryInputs["get post by slug"];
export type GetPostBySlugOutput = BlogQueryOutputs["get post by slug"];

export type GetPostsWithTagsInput = BlogQueryInputs["get posts with tags"];
export type GetPostsWithTagsOutput = BlogQueryOutputs["get posts with tags"];

export type GetAllTagsInput = BlogQueryInputs["get all tags"];
export type GetAllTagsOutput = BlogQueryOutputs["get all tags"];

export type GetPostsByTagInput = BlogQueryInputs["get posts by tag"];
export type GetPostsByTagOutput = BlogQueryOutputs["get posts by tag"];

export type GetPostCommentsInput = BlogQueryInputs["get post comments"];
export type GetPostCommentsOutput = BlogQueryOutputs["get post comments"];

export type SearchPostsInput = BlogQueryInputs["search posts"];
export type SearchPostsOutput = BlogQueryOutputs["search posts"];

export type CreateAuthorInput = BlogMutationInputs["create author"];
export type CreateAuthorOutput = BlogMutationOutputs["create author"];

export type UpdateAuthorInput = BlogMutationInputs["update author"];
export type UpdateAuthorOutput = BlogMutationOutputs["update author"];

export type CreatePostInput = BlogMutationInputs["create post"];
export type CreatePostOutput = BlogMutationOutputs["create post"];

export type UpdatePostInput = BlogMutationInputs["update post"];
export type UpdatePostOutput = BlogMutationOutputs["update post"];

export type PublishPostInput = BlogMutationInputs["publish post"];
export type PublishPostOutput = BlogMutationOutputs["publish post"];

export type CreateTagInput = BlogMutationInputs["create tag"];
export type CreateTagOutput = BlogMutationOutputs["create tag"];

export type CreateCommentInput = BlogMutationInputs["create comment"];
export type CreateCommentOutput = BlogMutationOutputs["create comment"];

export type ApproveCommentInput = BlogMutationInputs["approve comment"];
export type ApproveCommentOutput = BlogMutationOutputs["approve comment"];

// Keep original types for backward compatibility
export type BlogQueries = typeof queries;
export type BlogMutations = typeof mutations;