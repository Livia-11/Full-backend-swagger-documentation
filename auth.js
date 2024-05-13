const jwt = require("jsonwebtoken");
const config = require("config");


function verify(req, res, next) {

    let token = req.headers.authorization;
    console.log(token);

    if (!token) {
        res.send("No token found");
    } else {
        jwt.verify(token.split(' ')[1],'limac', (error, decoded) => {
            if (error) {
                console.log(`Err:${error}`);
            } else {
                console.log("done");
                next();
            }
        })
    }
}
module.exports = verify;