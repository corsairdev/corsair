const test = require("ava")
const bent = require("bent")
const postgrest = require("../")
const getPort = require("get-port")

const getJSON = bent("json")

test("postgrest should respond to requests after running", async (t) => {
  const serverPort = await getPort()
  const server = await postgrest.startServer({
    dbUri: "postgres://postgres@127.0.0.1:5432/postgres",
    dbSchema: "public",
    serverPort,
    dbAnonRole: "postgres",
  })
  const response = await getJSON(`http://127.0.0.1:${serverPort}`)
  t.is(response.info.title, "PostgREST API")

  server.stop()
})
