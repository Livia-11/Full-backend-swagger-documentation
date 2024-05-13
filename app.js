const express = require("express");
const app = express();
const config = require("config");
const mongoConn = require("./models/mongo");
const controller = require("./controllers/studentController");
const bodyParser = require("body-parser");
const swaggerui = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const options = require("./swagger");
const specs = swaggerJsDoc(options);
const port = config.get("server.port");
 
 

app.use("/api.docs",swaggerui.serve,swaggerui.setup(specs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use("/student", controller);

app.listen(port,()=>{
    console.log("Connected Succesfully");
})