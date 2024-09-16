const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const authenticationRoute = require("./routes/authentication.routes");

app.use(express.json());
app.use(cors());

app.use("/api", authenticationRoute);

app.get("/", (req, res) => {
  res.json("Server is running successfully!");
});

app.listen(PORT, console.log("Server started on port: " + PORT));
