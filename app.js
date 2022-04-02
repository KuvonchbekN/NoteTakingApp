//third party libraries
const express = require("express");
const app = express();
const PORT = 8000;

//node libs
const fs = require("fs");

app.set("view engine", "pug"); //this will set the view engine to the pug
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  fs.readFile("./data/notes.json", (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);
    res.render("home", { notes: notes });
  });
});

app.get("/:id/delete", (req, res) => {
  const id = req.params.id;
  console.log(id);

  fs.readFile("./data/notes.json", (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);
    // res.render("home", { success: true, notes: notes });

    const filteredNotes = notes.filter((note) => note.id != id);

    fs.writeFile("./data/notes.json", JSON.stringify(filteredNotes), (err)=>{
      if(err) throw err;

      res.render("home", {notes : filteredNotes, deleted : true})
    })
  });
});

app.post("/create", (req, res) => {
  const formData = req.body;

  if (
    //if the user did not input anthing in one of the inputs
    formData.noteTitle.trim() == "" ||
    formData.noteDescription.trim() == ""
  ) {
    fs.readFile("./data/notes.json", (err, data) => {
      if (err) throw err;

      const notes = JSON.parse(data);
      res.render("home", { error: true, notes: notes });
    });
  } else {
    //get all notes
    fs.readFile("./data/notes.json", (err, data) => {
      if (err) throw err;

      const notes = JSON.parse(data);

      const note = {
        id: id(),
        noteTitle: formData.noteTitle,
        noteDescription: formData.noteDescription,
        isActive: true,
      };
      notes.push(note);

      fs.writeFile("./data/notes.json", JSON.stringify(notes), (err) => {
        if (err) throw err;
      });

      res.render("home", { success: true, notes: notes });
    });
  }
});

//starts the server port number 8000
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("The server is working properly!");
});

function id() {
  const id = "_" + Math.random().toString(36).substring(2, 9);
  return id;
}
