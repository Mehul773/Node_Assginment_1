const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;

const app = express();
const PORT = 3000;

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Home route
app.get("/", (req, res) => {
  // Display greeting and navigation links
  res.send(`
        <h1>Welcome to User Management System!</h1>
        <a href="/users">View Users</a>
        <a href="/create">Create User</a>
    `);
});

// Users route
app.get("/users", async (req, res) => {
  try {
    // Read user data from file
    const data = await fs.readFile("users.txt", "utf8");
    const users = data.split("\n").filter(Boolean);
    if (users.length === 0) {
      // Redirect to create page if no users
      res.redirect("/create");
      return;
    }
    // Display users and navigation links
    res.send(`
            <h2>Users:</h2>
            <ul>
                ${users.map((user) => `<li>${user}</li>`).join("")}
            </ul>
            <a href="/">Home</a>
            <a href="/create">Create User</a>
        `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Create route
app.get("/create", (req, res) => {
  // Display form for creating user and navigation links
  res.send(`
        <h2>Create User:</h2>
        <form action="/add" method="post">
            <label for="userName">User Name:</label>
            <input type="text" id="userName" name="userName" required>
            <button type="submit">Submit</button>
        </form>
        <a href="/">Home</a>
        <a href="/users">View Users</a>
    `);
});

// Add route (for adding a user)
app.post("/add", async (req, res) => {
  const { userName } = req.body;
  try {
    // Append new user to file
    await fs.appendFile("users.txt", `${userName}\n`);
    // Redirect to users page
    res.redirect("/users");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
