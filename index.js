const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;


require("./start/logging")();
require("./start/config")();
require("./start/db")();
require("./start/routes")(app);

app.listen(PORT,()=>console.log(`Server is listening at port ${PORT}`));