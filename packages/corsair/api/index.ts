import { PostgrestClient } from "@supabase/postgrest-js";

const REST_URL = "http://localhost:3000";
const postgrest = new PostgrestClient(REST_URL);

const main = async () => {
  const res = await postgrest.from("users3").select("*");
  console.log(res);
  return res;
};

// Uncomment to test connection
main();
