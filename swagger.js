const { type } = require("os");

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Student Management System",
            description: "A simple crud operation for managing students",
            version: "1.0.0"
        },
        servers:[
            {
                url:"http://localhost:5000",
                description: "Development server",
            }
        ],
        components:{
            schemas:{
                student:{
                    type:"object",
                    properties:{
                        Names:{
                            type:"string",
                            description:"The names of the student"
                        },
                        class:{
                            type:"string",
                            description:"The class in which the students belong to"
                        },
                        field:{
                            type:"string",
                            description:"The field the students take"
                        },
                    }

                }
            },
            securitySchemes:{
                bearerAuth:{
                    type:"http",
                    scheme:"bearer",
                    bearerFormat:"JWT"
                }
            },
            security:[
                {
                    bearerAuth:[]
                }
            ],
        }
    },
    apis:["./controllers/studentController.js"]
}
module.exports=options;