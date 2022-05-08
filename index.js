const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const jwt = require('jsonwebtoken');
require("dotenv").config();

app.use(cors());
app.use(express.json());

// Connect Database (Mongodb).

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.buxdo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// post mathod -
app.post('/login',async(req,res)=>{
  const user = req.body;
  const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN,{
    expiresIn: '1d'
  })
  res.send({accessToken});
})

async function run() {
  try {
    await client.connect();
    const inventoryCollection = client
      .db("oracleInventory")
      .collection("inventory");

    // get mathod -  
    app.get("/inventory", async (req, res) => {
      const quarry = {};
      const cursor = inventoryCollection.find(quarry);
      const inventory = await cursor.toArray();
      res.send(inventory);
    });

    // get mathod -
    app.get("/manage-inventory", async (req, res) => {
      const { email } = req.query;
      const cursor = inventoryCollection.find({ email });
      const inventory = await cursor.toArray();
      if (inventory.length > 0) {
        res.status(200).send({
          status: 1,
          data: inventory,
        });
      } else {
        res.status(200).send({
          status: 0,
          data: inventory,
        });
      }
    });

    //Add New Item
    app.post("/inventory", async (req, res) => {
      const newItem = req.body;
      const result = await inventoryCollection.insertOne(newItem);
      res.send(result);
    });

    // Delete Item
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const quarry = { _id: ObjectId(id) };
      const result = await inventoryCollection.deleteOne(quarry);
      res.send(result);
    });
    // post mathod -
    app.post("/checkout/:id", async (req, res) => {
      console.log(req.body.quantity);
      if (Number(req.body.quantity < 0)) {
        res.send({ status: 0, message: "Oops! Stock Out." });
        return;
      }
      const id = req.params.id;
      const quarry = { _id: ObjectId(id) };
      const result = await inventoryCollection.updateOne(quarry, {
        $set: { quantity: req.body.quantity },
      });
      if (result.modifiedCount > 0) {
        res.send({ status: 1, message: "Order Place Successfully." });
      } else {
        res.send({ status: 0, message: "Order Place Faild." });
      }
    });

    // post mathod -
    app.post("/re_stock/:id", async (req, res) => {
      if (Number(req.body.quantity < 0)) {
        res.send({ status: 0, message: "Oops! Restock Faild." });
        return;
      }
      const { quantity, stock } = req.body;
      const id = req.params.id;
      const quarry = { _id: ObjectId(id) };
      const result = await inventoryCollection.updateOne(quarry, {
        $set: { quantity: Number(quantity) + Number(stock) },
      });
      if (result.modifiedCount > 0) {
        res.send({ status: 1, message: "Restock Successfully." });
      } else {
        res.send({ status: 0, message: "Restock Faild." });
      }
    });
  } finally {
  }
}

// call run function.
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Loding...");
});
app.listen(port, () => {
  console.dir("Loading...", port);
});
