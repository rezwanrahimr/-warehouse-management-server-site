const express = require('express');
const app =  express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Connect Database (Mongodb).

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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


            // Delete
            app.delete('/inventory/:id',async(req,res) =>{
                const id = req.params.id;
                const quarry = {_id:ObjectId(id)};
                const result = await inventoryCollection.deleteOne(quarry);
                res.send(result);
            })
            /* // find one and update.
            app.patch('/inventory/:id',async(req,res) =>{
                console.log(req.body.quantity)
                const id = req.params.id;
                const quarry = {_id:ObjectId(id)};
                const result = await inventoryCollection.updateOne(quarry,{$set:{quantity:req.body.quantity}});
                if(result.modifiedCount > 0){
                    res.send({status:1,message:'Order Place'})
                }
                else{
                    res.send({status:0,message:'Order Place faild'})
                }
               
            }) */

            //add new items
            app.post('/inventory',async(req,res) =>{
                const newItem = req.body;
                const result = await inventoryCollection.insertOne(newItem);
                res.send(result);
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