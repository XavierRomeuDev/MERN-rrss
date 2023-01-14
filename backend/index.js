//Import dependencies
const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

//Database connection
connection();

//Create node server
const app = express();
const port = 7777;

//Cors configuration
app.use(cors());

//Transform body data to js objects
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Load conf routes
const userRoutes = require("./routes/user");
const publicationRoutes = require("./routes/publication");
const followRoutes = require("./routes/follow");

app.use("/api/user", userRoutes);
app.use("/api/publication", publicationRoutes);
app.use("/api/follow", followRoutes);

//Run server to hear http petitions
app.listen(port, () =>{
    console.log("Node server running on port: " + port);
});