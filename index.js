const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const app = express();
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mtdwi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const ProductCollection = client.db("product").collection("items");

    app.get("/inventory", async (req, res) => {
      const query = req.body;
      const cursor = ProductCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Product Details Api 

    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const productId = await ProductCollection.findOne(query);
      res.send(productId);
    });

    // Delete Single Product 

    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const deletProduct = await ProductCollection.deleteOne(query);
      res.send(deletProduct);
    });

    
    
    // Product Add

    app.post("/inventory", async (req, res) => {
      const query = req.body;
      const newProduct = await ProductCollection.insertOne(query);
      res.send(newProduct);
    });

    // Find Email All Products

    app.get("/myItems", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = ProductCollection.find(query);
      const myitem = await cursor.toArray();
      res.send(myitem);
    });

    // create token login 
    app.post('/login', async(req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SCREET,{
        expiresIn: '1d'
      })
      res.send({accessToken})
    })
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
