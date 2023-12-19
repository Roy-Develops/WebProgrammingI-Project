const express = require("express");
const AdminRouter = express.Router();
const connection = require("C:/Users/user/OneDrive/Desktop/WebProgramming I Project/DBconnection");
const path = require("path");
const session = require("express-session");
AdminRouter.use(express.json());
AdminRouter.use(express.urlencoded({ extended: true }));
AdminRouter.use(
  session({
    secret: "abcdefg123456789",
    resave: false,
    saveUninitialized: true,
  })
);
// Define routes for admin pages
AdminRouter.get("/", (req, res) => {
  // Query the products from the database
  connection.con.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("Error querying products:", err);
      res.status(500).send("Internal Server Error");
    } else {
      // Render the 'index' EJS template with the products data
      res.render("adminIndex", { products: results });
    }
  });
});

AdminRouter.get("/clients", (req, res) => {
  const query = "SELECT * FROM clients";
  connection.con.query(query, (error, results) => {
    if (error) {
      res.status(500).send("Error retrieving clients");
    } else {
      res.render("clients", { clients: results });
    }
  });
});
AdminRouter.get("/search", (req, res) => {
  console.log(req.session.searchedProduct);
  connection.con.query(
    "SELECT * FROM products WHERE product_name LIKE ?",
    [`%${req.session.searchedProduct}%`],
    (err, results) => {
      if (err) {
        console.error("Error querying products:", err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(results);
        res.render("adminSearchedProducts", { products: results });
      }
    }
  );
});
AdminRouter.get("/searchClient", (req, res) => {
  console.log(req.session.searchedClient);
  connection.con.query(
    "SELECT * FROM clients WHERE email LIKE ?",
    [`%${req.session.searchedClient}%`],
    (err, results) => {
      if (err) {
        console.error("Error querying products:", err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(results);
        res.render("adminSearchedClient", { clients: results });
      }
    }
  );
});

AdminRouter.post("/search", (req, res) => {
  let productName = req.body.searchedProduct;
  req.session.searchedProduct = productName;
  res.redirect("/admin/search");
});

AdminRouter.post("/searchClient", (req, res) => {
  let clientName = req.body.searchedClient;
  req.session.searchedClient = clientName;
  res.redirect("/admin/searchClient");
});
AdminRouter.post("/add", (req, res) => {
  let productName = req.body.productName;
  let productPrice = req.body.productPrice;

  // Insert the product id into the 'purchases' table
  connection.con.query(
    "INSERT INTO products (product_name,price) VALUES (?,?)",
    [productName, productPrice],
    (err, results) => {
      if (err) {
        console.error("Error inserting product id:", err);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("Product added successfully");
        res.redirect("/admin");
      }
    }
  );
});

AdminRouter.get("/messages", (req, res) => {
  const query = "SELECT * FROM contact_us";
  connection.con.query(query, (error, results) => {
    if (error) {
      res.status(500).send("Error retrieving messages");
    } else {
      res.render("messages", { messages: results });
    }
  });
});

AdminRouter.get("/updateProduct", (req, res) => {
  const query = "SELECT * FROM products";
  connection.con.query(query, (error, results) => {
    if (error) {
      res.status(500).send("Error retrieving products");
    } else {
      res.render("updateProduct", { products: results });
    }
  });
});
AdminRouter.get("/delete", (req, res) => {
  const query = "SELECT * FROM products";
  connection.con.query(query, (error, results) => {
    if (error) {
      res.status(500).send("Error retrieving products");
    } else {
      res.render("deleteProduct", { products: results });
    }
  });
});
// Update a single product by its ID
AdminRouter.post("/updateProduct", (req, res) => {
  const productId = req.body.productId;
  const productName = req.body.productName;
  const productPrice = req.body.productPrice;
  const query = "UPDATE products SET product_name = ?, price = ? WHERE id = ?";
  connection.con.query(
    query,
    [productName, productPrice, productId],
    (error, results) => {
      if (error) {
        res.status(500).send("Error updating product");
        console.log("error updating");
      } else {
        console.log("product updated successfully");
        res.redirect("/admin/updateProduct");
      }
    }
  );
});
AdminRouter.post("/delete", (req, res) => {
  const productId = req.body.productId;
  const query = "DELETE FROM products WHERE id = ?";
  connection.con.query(query, [productId], (error, results) => {
    if (error) {
      res.status(500).send("Error deleting product");
    } else {
      console.log("product deleted successfully");
      res.redirect("/admin/delete");
    }
  });
});
// Export the router
module.exports = AdminRouter;
