const express=require('express');
const app=express();
const port=process.env.PORT || 5000;
const cors=require('cors');
// const mongoose=require('mongoose');
require('dotenv').config();

app.use(cors());
app.use(express.json());
const name=process.env.DB_DATABASE;
const password=process.env.DB_PASSWORD;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { parse } = require('dotenv');
const uri = `mongodb+srv://${name}:${password}@cluster0.231nuf3.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log("Connected correctly to server");

    const userCollection = client.db("cricketScorer").collection("users");
    const bawlerCollection = client.db("cricketScorer").collection("bawlers");
    app.post('/addUser',(req,res)=>{
        const user=req.body;
        const query={email:user.email,name:user.name};
        const result=userCollection.insertOne(query);
        res.send(result);
    })
    app.get('/users',async(req,res)=>{
        const cursor = userCollection.find();
        const sponsors = await cursor.toArray();
        res.send(sponsors);
      });
      app.post('/bawlers',async(req,res)=>{
        const bawler=req.body;
        console.log(bawler);
        const query={name:bawler.name,
          run:bawler.run,
          wicket:bawler.wicket,
          noball:bawler.noball,
          wide:bawler.wide,
          over:bawler.over,
          maiden:bawler.maiden};
        const result=await bawlerCollection.insertOne(query);
        res.send(result);
        console.log(result);

      })
      app.get('/bawlers',async(req,res)=>{
        const cursor = bawlerCollection.find();
        const bawlers = await cursor.toArray();
        res.send(bawlers);
      });
      app.patch('/bawler/:id',async(req,res)=>{
        const id=req.params.id;
        console.log(id);
        const bawler=req.body;
        const query={_id: new ObjectId(id)};
        const pre=await bawlerCollection.findOne(query);
        console.log(pre);
        const updateDoc={
          $set:{
            run:bawler.run+pre.run,
            wicket:bawler.wicket,
            noball:bawler.noball,
            wide:bawler.wide,
            over:Number.parseFloat(bawler.over+pre.over).toFixed(1),
            maiden:parseInt(bawler.maiden)+parseInt(pre.maiden)
          }
        }
        const result=await bawlerCollection.updateOne(query,updateDoc);
        res.send(result);
      })
      app.get("/bawler/:id",async(req,res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)};
        const result=await bawlerCollection.findOne(query);
        res.send(result);
      })
    













    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Cricket Scorer Server is running');
})
app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
    
})

// 7kASbXfWNpv5ucnF
// cricketScorerAdmin