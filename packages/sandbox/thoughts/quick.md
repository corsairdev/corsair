this is going to be so you just have to declare what a query / mutation should be combined with your schema.

you just write your schema like you would your zod schema.

you write your queries and mutations in natural language

when you update your schema, all queries and mutations dependent on that schema are immediately retriggered and will update accordingly

you will also have a studio where you can see the queries and mutations you wrote and the code behind them. this means you have full code visibility as well, it's just slightly abstracted. you can also edit that code if you don't like something in it

that studio will have three pages:

- schema (this is just a visual editor where you can change the schema and then also a mermaid where you can see relationships to visualize it)
- queries (list of your queries in natural language, where they're referenced, their types, tests if you want, and the actual code)
- mutations (^ same as above)

an active terminal will be open below your editor.
that terminal is a watch script that watches your entire directory and sees the changes you're making
if you change a hook, it will call the LLM with the api key you defined and update all dependencies
when you push this to prod, you are not calling LLMs, you have cached the operations


so the user should be able to query the db and make mutations to it while also changing its schema