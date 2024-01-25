/**
 * I have used Express.js, a Node.js package for creating backend web servers.
 * Please make sure port 3000 is available. If it is not, please change the port number on line 10.
 */
const express = require("express");
const app = express();

const receiptsRouter = require("./routers/receiptsRouter");

const port = process.env.PORT || 3000;
app.set("port", port);

app
  .use(express.json())
  .use("/receipts", receiptsRouter)
  .listen(
    app.get("port"),
    console.log("Listening to port", port)
  );
