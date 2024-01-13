import {} from "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DBPORT,
  
});
db.connect();

let currentSectionId = 1;

async function checkTasks() {
  const result = await db.query(
    `SELECT item_name FROM items WHERE section_id=${currentSectionId}`
  );
  let tasks = [];
  result.rows.forEach((task) => {
    tasks.push(task.item_name);
  });
  return tasks;
}

app.get("/", async (req, res) => {
  const itemTask = await checkTasks();
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  var today = new Date();
  const day = today.toLocaleDateString("en-US", options);
  res.render("index.ejs", { tasks: itemTask, day: day });
});

app.post("/", async (req, res) => {
  let newItem = req.body["newItem"];

  try {
    await db.query(
      "INSERT INTO items (item_name, section_id) VALUES ($1, $2)",
      [newItem, currentSectionId]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/work", async (req, res) => {
  let newItem = req.body["newItem"];

  try {
    await db.query(
      "INSERT INTO items (item_name, section_id) VALUES ($1, $2)",
      [newItem, currentSectionId]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/today", (req, res) => {
  currentSectionId = req.body.id;
  res.redirect("/");
});

app.post("/work-list", async (req, res) => {
  currentSectionId = req.body.id;
  const tasks = await checkTasks();
  res.render("index2.ejs", { newListItems: tasks });
});

app.listen(process.env.PORT || 3000);

