// import { executeCorsairMutation } from "../api/mutation";
// import { CorsairMutations } from "../client";

// export function createCloudflareHandler<TMutations extends CorsairMutations>(
//   mutations: TMutations
// ) {
//   return async (request: Request): Promise<Response> => {
//     const body = await request.json();
//     const result = await executeCorsairMutation(mutations, body, conte);

//     if (result.success) {
//       return new Response(JSON.stringify(result.data), {
//         headers: { "Content-Type": "application/json" },
//       });
//     } else {
//       const status = result.error.includes("validation") ? 400 : 500;
//       return new Response(
//         JSON.stringify({ message: result.error, errors: result.errors }),
//         {
//           status,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }
//   };
// }
