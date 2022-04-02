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
  fs.readFile("./data/tasks.json", (err, data) => {
    if (err) throw err;

    const tasks = JSON.parse(data);
    res.render("home", { tasks: tasks });
  });
});

app.get("/:id/delete", (req, res) => {
  const id = req.params.id;
  console.log(id);

  fs.readFile("./data/tasks.json", (err, data) => {
    if (err) throw err;

    const tasks = JSON.parse(data);

    const filteredtasks = tasks.filter((task) => task.id != id);

    fs.writeFile("./data/tasks.json", JSON.stringify(filteredtasks), (err)=>{
      if(err) throw err;

      res.render("home", {tasks : filteredtasks, deleted : true})
    })
  });
});


app.get("/:id/complete", (req, res)=>{
  const id = req.params.id;

  fs.readFile("./data/tasks.json", (err, data)=>{
    if(err) throw err;

    const tasks = JSON.parse(data);
    const task =  tasks.filter(task => task.id==id)[0]
    const taskIdx = tasks.indexOf(task);

    const splicedTask = tasks.splice(taskIdx, 1)[0];
    splicedTask.isActive = false;

    tasks.push(splicedTask);
    fs.writeFile("./data/tasks.json", JSON.stringify(tasks), (err)=>{
      if(err) throw err;

      res.render("home", {tasks : tasks})
    })
  })
})


app.get("/:id/incomplete", (req, res)=>{
  const id = req.params.id;

  fs.readFile("./data/tasks.json", (err, data)=>{
    if(err) throw err;

    const tasks = JSON.parse(data);
    const task =  tasks.filter(task => task.id==id)[0]
    const taskIdx = tasks.indexOf(task);

    const splicedTask = tasks.splice(taskIdx, 1)[0];
    splicedTask.isActive = true;

    tasks.push(splicedTask);
    console.log(tasks);
    fs.writeFile("./data/tasks.json", JSON.stringify(tasks), (err)=>{
      if(err) throw err;

      res.render("home", {tasks : tasks})
    })
  })
})

app.post("/create", (req, res) => {
  const formData = req.body;

  if (
    //if the user did not input anthing in one of the inputs
    formData.taskTitle.trim() == "" ||
    formData.taskDescription.trim() == ""
  ) {
    fs.readFile("./data/tasks.json", (err, data) => {
      if (err) throw err;

      const tasks = JSON.parse(data);
      res.render("home", { error: true, tasks: tasks });
    });
  } else {
    //get all tasks
    fs.readFile("./data/tasks.json", (err, data) => {
      if (err) throw err;

      const tasks = JSON.parse(data);

      const task = {
        id: id(),
        taskTitle: formData.taskTitle,
        taskDescription: formData.taskDescription,
        isActive: true,
      };
      tasks.push(task);

      fs.writeFile("./data/tasks.json", JSON.stringify(tasks), (err) => {
        if (err) throw err;
      });

      res.render("home", { success: true, tasks: tasks });
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
