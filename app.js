const express = require("express");
const app = express();
const PORT = 8000;

app.set("view engine", "pug"); //this will set the view engine to the pug
app.use("/static", express.static("public"));

app.get("/", (req, res) => {
    res.render("home");
});

app.listen(PORT, (err) => {
  if (err) throw err;

  console.log("The server is working properly!");
});
