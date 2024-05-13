const express = require("express");
const router = express.Router();
const studentModel = require("../models/students");
const jwt = require("jsonwebtoken");
const signup = require("../models/signup");
const debug = require("debug")("Output");
const auth = require("../auth")
const joi = require("joi")


/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Apis to manage students
 */

/**
 * @swagger
 * /student/add:
 *   post:
 *     summary: A post request to add student
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/student'
 *     responses:
 *       "200":
 *         description: A message specifying whether your email was sent or not
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/student'
 */



router.post("/add",auth, async (req, res) => {

    const schema=joi.object({
        username:joi.string().required(),
        password:joi.string().required(),
        positionId:joi.string().required(),
         
    });

    const validity=schema.validate(req.body);
        if(validity.error){
            res.send(validity.error.details[0].message);
            return;
        }

    try {

        const student = await studentModel.create({
            Names: req.body.Names,
            Class: req.body.Class,
            Field: req.body.Field,
            PositionId: req.body.PositionId
        });

        const newStudent = await student.save();
        res.send(newStudent);

    } catch (error) {

        debug(error);

    }
})

/**
 * @swagger
 * '/student/get':
 *   get:
 *     summary: Get all students
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successed operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/student'
 *       '500':
 *         description: Internal server error
 */



router.get("/get", auth, async (req, res) => {
    try {
        const students = await studentModel.find();
        res.send(students);
    } catch (error) {
        debug(error);
    }
});



/**
 * @swagger
 * '/student/update/{id}':
 *   put:
 *     summary: Update a student
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/student'
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/student'
 *       '404':
 *         description: Student not found!
 *       '500':
 *         description: Internal error
 */



          
router.put("/update/:id", auth, async (req, res) => {
    try {
        const student = await studentModel.findById(req.params.id);
        if (!student) {
            return res.status(404).send({ message: "Student not found" });
        }
        student.Names = req.body.Names;
        student.Class = req.body.Class;
        student.Field = req.body.Field;
        student.PositionId = req.body.PositionId;
        const updatedStudent = await student.save();
        res.send(updatedStudent);
    } catch (error) {
        debug(error);
    }
});



/**
 * @swagger
 * /student/delete/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Student ID
 *     responses:
 *       '200':
 *         description: Success operation
 */



router.delete("/delete/:id", auth, async (req, res) => {
    try {
        const deletedStudent = await studentModel.findByIdAndDelete(req.params.id);
        if (!deletedStudent) {
            return res.status(404).send({ message: "Student not found" });
        }
        res.send({ message: "Student deleted successfully" });
    } catch (error) {
        debug(error);
    }
});


/**
 * @swagger
 * /student/signup:
 *   post:
 *     summary: Create a new user account
 *     description: Register a new user with the provided username, password, and position ID
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               positionId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal server error
 */

router.post("/signup", async (req, res) => {
    try {
      const user = await signup.create({
        username: req.body.username,
        password: req.body.password,
        positionId: req.body.positionId
      });
  
      res.status(200).json(user); // Sending back the created user as response
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });


/**
 * @swagger
 * /student/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal server error
 */



    router.get("/users", auth, async (req, res) => {
        try {
            const users = await signup.find();
            res.send(users);
        } catch (error) {
            debug(error);
        }
    });


 /**
 * @swagger
 * /student/signup/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update an existing user's information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               positionId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */




    router.put("/signup/:id", auth, async (req, res) => {
        try {
            const user = await signup.findById(req.params.id);
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            user.username = req.body.username;
            user.password = req.body.password;
            user.positionId = req.body.positionId;
            const updatedUser = await user.save();
            res.send(updatedUser);
        } catch (error) {
            debug(error);
        }
    });

    /**
 * @swagger
 * /student/signup/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete an existing user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */




    router.delete("/signup/:id", auth, async (req, res) => {
        try {
            const deletedUser = await signup.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                return res.status(404).send({ message: "User not found" });
            }
            res.send({ message: "User deleted successfully" });
        } catch (error) {
            debug(error);
        }
    });


   /**
 * @swagger
 * /student/login:
 *   post:
 *     summary: Authenticate user
 *     description: Authenticate user credentials and generate JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *               PositionId:
 *                 type: string
 *                 description: The position ID of the user
 *     responses:
 *       '200':
 *         description: Authentication successful, JWT token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiJhZG1pbiIsIlBvc2l0aW9uSWQiOiJwYXNzd29yZCJ9.1nrUG-ZoZmHzgP_MNXyvlwzX6rJ58wm-O-gy6X9oHrA"
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */




router.post("/login", async (req, res) => {

    const data = {
        username: req.body.username,
        password: req.body.password,
        PositionId: req.body.PositionId
    }


    const exists = await signup.findOne({ username: data.username });

    if (!exists) {

        debug("no user found");

    } else {

        const payload = {
            username: data.username,
            password: data.password,
            PositionId: req.body.PositionId
        }

        const token = jwt.sign(payload, 'limac');
        res.json(token);

    }

});

/**
 * @swagger
 * /student/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a user by their ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */



router.get("/users/:id", auth, async (req, res) => {
    try {
        const user = await signup.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.send(user);
    } catch (error) {
        debug(error);
    }
});

/**
 * @swagger
 * /student/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     description: Update a user's information by their ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               PositionId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */



router.put("/users/:id", auth, async (req, res) => {
    try {
        const user = await signup.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        user.username = req.body.username;
        user.password = req.body.password;
        user.PositionId = req.body.PositionId;
        const updatedUser = await user.save();
        res.send(updatedUser);
    } catch (error) {
        debug(error);
    }
});

/**
 * @swagger
 * /student/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Delete a user by their ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */




router.delete("/users/:id", auth, async (req, res) => {
    try {
        const deletedUser = await signup.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).send({ message: "User not found" });
        }
        res.send({ message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;