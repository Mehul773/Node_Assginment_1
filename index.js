const http = require("http");
const fs = require("fs").promises;
const PORT = 3000;

const server = http.createServer(async (req, res) => {
  console.log(`Server created on ${PORT}`);
  const url = req.url;

  if (url === "/") {
    // Home route
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <h1>Welcome to User Management System!</h1>
      <a href="/users">View Users</a>
      <a href="/create">Create User</a>
    `);
  } else if (url === "/users") {
    // Users route
    try {
      const data = await fs.readFile("users.txt", "utf8");
      const users = data.split("\n").filter(Boolean);
      if (users.length === 0) {
        // Redirect to create page if no users
        res.writeHead(302, { Location: "/create" });
        res.end();
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      //Display users
      res.end(`
        <h2>Users:</h2>
        <ul>
          ${users.map((user) => `<li>${user}</li>`).join("")}
        </ul>
        <a href="/">Home</a>
        <a href="/create">Create User</a>
      `);
    } catch (error) {
      console.error(error);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  } else if (url === "/create") {
    // Create route
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <h2>Create User:</h2>
      <form action="/add" method="post">
        <label for="userName">User Name:</label>
        <input type="text" id="userName" name="userName" required>
        <button type="submit">Submit</button>
      </form>
      <a href="/">Home</a>
      <a href="/users">View Users</a>
    `);
  } else if (url === "/add" && req.method === "POST") {
    // Add route (for adding a user)
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      const userName = Buffer.concat(body).toString();
      try {
        await fs.appendFile("users.txt", `${userName}\n`);
        res.writeHead({ Location: "/users" });
        res.end();
      } catch (error) {
        console.error(error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      }
    });
  } else {
    // Not Found
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
