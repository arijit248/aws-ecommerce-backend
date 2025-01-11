const express = require("express");
const cors = require("cors");
const MongoConnect = require("./utils/db").MongoConnect;
const route = require("./route");
const fileUpload = require("express-fileupload");
const app = express();

app.use(cors());
app.use(express.json());
// app.use(fileUpload());
app.use(route);

MongoConnect(() => {
  app.listen(8000, () => console.log("server is running 8000"));
});
