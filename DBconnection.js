const mysql = require("mysql2");
var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "AsdfQwerty123!@#",
  database: "webprogramming1",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = { con };
