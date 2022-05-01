const express = require('express');
const app =  express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Connect Database (Mongodb).

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.buxdo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
            await client.connect();
            const inventoryCollection = client.db('oracleInventory').collection('inventory');
            
            // get mathod -  find all data
            app.get('/inventory',async(req,res)=>{
                const quarry = {};
                const cursor = inventoryCollection.find(quarry);
                const inventory = await cursor.toArray();
                res.send(inventory);
            })
    }
    finally{

    }
}

// call run function.
run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send('Loding...');
})
app.listen(port,()=>{
    console.dir('Loading...',port);
})