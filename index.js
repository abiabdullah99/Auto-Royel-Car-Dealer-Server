const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const app = express();


app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });