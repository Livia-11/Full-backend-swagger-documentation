const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1/workdb";

function conn() {
    try {

        mongoose.connect(url);

    } catch (error) {

        console.log(error);

    }
    const dbconn = mongoose.connection;
    dbconn.once("open", () => {
        console.log("DB connected");
    });
    dbconn.on("error", (error) => {
        console.log(error);
    });
}
conn();