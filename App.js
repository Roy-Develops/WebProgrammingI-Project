const express = require("express");
const session = require("express-session");
const app = express();
const port = 3000;
const path = require("path");
const bodyParser = require("body-parser");
//* creating the paths
let signUpPath = path.join(__dirname, "./public/signUp.html");
let loginPath = path.join(__dirname, "./public/logIn.html");
let contactUsPath = path.join(__dirname, "./public/contactUs.html");
let surveyPath = path.join(__dirname, "./public/survey.html");
//* setting the connection to the database
const connection = require("./DBconnection");
//* Set the view engine to EJS
app.set("view engine", "ejs");
//* setting up the app
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "abcdefg123456789",
    resave: false,
    saveUninitialized: true,
  })
);
const multer = require("multer");
const AdminRouter = require("./routes/adminRouter");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Set the destination folder
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize multer with the storage options
const upload = multer({ storage: storage });
//* get methods
app.get("/signUp", (req, res) => {
  res.sendFile(signUpPath);
});
app.get("/login", (req, res) => {
  res.sendFile(loginPath);
});
app.get("/contactUs", (req, res) => {
  res.sendFile(contactUsPath);
});
app.get("/survey", loggedIn, (req, res) => {
  res.sendFile(surveyPath);
});
app.get("/", (req, res) => {
  req.session.loggedIn = 0;
  res.sendFile(path.join(__dirname, "./public/home.html"));
});
app.get("/profile", loggedIn, (req, res) => {
  const clientId = req.session.clientId;

  connection.con.query(
    "SELECT * FROM clients WHERE id = ?",
    [clientId],
    function (err, result) {
      if (err) {
        console.log(err);
        res.send("Failed to retrieve client information!");
      } else {
        const clientInfo = result[0];
        res.render("profilePage.ejs", { client: clientInfo });
      }
    }
  );
});
app.get("/uploads", loggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "./public/uploadFile.html"));
});
app.get("/products", loggedIn, (req, res) => {
  // Query the products from the database

  connection.con.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("Error querying products:", err);
      res.status(500).send("Internal Server Error");
    } else {
      // Render the 'index' EJS template with the products data
      res.render("index", { products: results });
    }
  });
});
app.get("/search", loggedIn, (req, res) => {
  connection.con.query(
    "SELECT * FROM products WHERE product_name LIKE ?",
    [`%${req.session.searchedProduct}%`],
    (err, results) => {
      if (err) {
        console.error("Error querying products:", err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(results);
        res.render("seachedProducts", { products: results });
      }
    }
  );
});
app.get("/christmas", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/merry_xmas.html"));
});

//* post methods
app.post("/survey", (req, res) => {
  let q1 = req.body.q1;
  let q2 = req.body.q2;
  let q3 = req.body.q3;
  let q4 = req.body.q4;

  connection.con.query(
    "INSERT INTO survey (q1, q2, q3, q4,client_id) VALUES (?, ?, ?, ?,?)",
    [q1, q2, q3, q4, req.session.clientId],
    function (err, result) {
      if (err) {
        console.log(err);
        res.send("Failed to submit survey!");
      } else {
        console.log("Survey submitted successfully");
        res.send("<h1>Survey submitted successfully</h1>");
      }
    }
  );
});
app.post("/login", (req, res) => {
  let username = req.body.username;
  let pass = req.body.password;
  req.session.username = username;
  req.session.admin = 0;

  if (username === "admin" && pass === "admin") {
    res.redirect("/admin");
    req.session.admin = 1;
  } else {
    connection.con.query(
      "select * from clients where email = ? and pass = ?",
      [username, pass],
      function (err, result) {
        if (err) {
          console.log(err);
          res.send("<h1>Wrong username or password</h1>");
        } else {
          if (result.length > 0) {
            req.session.clientId = result[0].id; // Save client id in session
            req.session.loggedIn = 1;
            console.log("Login successful");
            res.redirect("/profile");
          } else {
            res.send("<h1>Wrong username or password</h1>");
          }
        }
      }
    );
  }
});

app.post("/signUp", (req, res) => {
  let fname = req.body.firstName;
  let lname = req.body.lastName;
  let email = req.body.email;
  let password = req.body.password;
  let phone = req.body.phone;

  connection.con.query(
    "SELECT * FROM clients WHERE email = ?",
    [email],
    function (err, result) {
      if (err) {
        console.log(err);
        res.send("Sign up Failed!");
      } else {
        if (result.length > 0) {
          res.send("Email already exists!");
        } else {
          connection.con.query(
            "INSERT INTO clients (first_name, last_name, email, pass, phone_number) VALUES (?, ?, ?, ?, ?)",
            [fname, lname, email, password, phone],
            function (err, result) {
              if (err) {
                console.log(err);
                res.send("Sign up Failed!");
              } else {
                console.log("SignUp successful");
                res.redirect("/login");
              }
            }
          );
        }
      }
    }
  );
});
app.post("/contactUs", (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;
  let phone_number = req.body.number;
  connection.con.query(
    "INSERT INTO contact_us (name, email, message,phone) VALUES (?, ?, ?,?)",
    [name, email, message, phone_number],
    function (err, result) {
      if (err) {
        console.log(err);
        res.send("there was an error sending your message:(");
      } else {
        console.log("Message sent Successfully");
        res.redirect("/contactUs");
      }
    }
  );
});
app.post("/profile", (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let password = req.body.password;
  let phoneNumber = req.body.phoneNumber;
  let userId = req.session.clientId;

  connection.con.query(
    "UPDATE clients SET first_name = ?, last_name = ?, email = ?, pass = ?, phone_number = ? WHERE id = ?",
    [firstName, lastName, email, password, phoneNumber, userId],
    function (err, result) {
      if (err) {
        console.log(err);
        res.send("Error updating profile");
      } else {
        console.log("Profile updated successfully");
        res.redirect("/");
      }
    }
  );
});
app.post("/deleteUser", (req, res) => {
  let userId = req.session.clientId;
  connection.con.query(
    "DELETE FROM clients WHERE id = ?",
    [userId],
    function (err, result) {
      if (err) {
        console.log(err);
        res.send("Error deleting profile");
      } else {
        console.log("Profile deleted successfully");
        res.redirect("/");
      }
    }
  );
});
app.post("/signOut", (req, res) => {
  req.session.loggedIn = 0;
  res.redirect("/");
});

app.post("/upload", upload.single("fileInput"), (req, res) => {
  res.redirect("/profile");
  console.log("File uploaded successfully");
});
app.post("/purchase", (req, res) => {
  let productId = req.body.productId;
  // Insert the product id into the 'purchases' table
  connection.con.query(
    "INSERT INTO purchases (client_id,product_id) VALUES (?,?)",
    [req.session.clientId, productId],
    (err, results) => {
      if (err) {
        console.error("Error inserting product id:", err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("Product purchased successfully");
        res.redirect("/products");
      }
    }
  );
});
app.post("/search", (req, res) => {
  let productName = req.body.searchedProduct;
  req.session.searchedProduct = productName;
  res.redirect("/search");
});
function loggedIn(req, res, next) {
  if (req.session.loggedIn === 1) {
    next();
  } else {
    res.send(`<h1>You must be logged in to proceed</h1>
    <a href="/login">Go to Login page</a>`);
  }
}
app.get("/reserve-dates", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/calendar.html"));
});
app.post("/reserve-dates", (req, res) => {
  const reservedDates = JSON.parse(req.body.reservedDates);
  reservedDates.forEach((date) => {
    const query =
      "INSERT INTO reservations (reserved_date, user_id) VALUES (?, ?)";
    connection.query(
      query,
      [new Date(date), req.session.clientId],
      (error, results, fields) => {
        if (error) throw error;
        else {
          console.log("success");
        }
      }
    );
  });
  res.json({ message: "Reservations saved" });
});

app.use("/admin", AdminRouter);
app.use(express.static("public"));
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
