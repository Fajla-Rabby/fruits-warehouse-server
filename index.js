const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware  
app.use(cors());
app.use(express.json());

//test for git

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kccqe.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const fruitsCollection = client.db('fruits').collection('items');

    app.get('/items', async (req, res) => {
      const query = {};
      const cursor = fruitsCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    })

    app.get('/items/:id', async(req, res) => 
    {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const items = await fruitsCollection.findOne(query);
      res.send(items);
    })

    //post
    app.post('/items', async(req, res) => {
      const newItems = req.body;
      const result = await fruitsCollection.insertOne(newItems);
      res.send(result);
    })

    //delete
    app.delete('/items/:id', async(req, res) => 
    {
      const  id = req.params.id;
      const query ={_id: ObjectID(id)};
      const result = await fruitsCollection.deleteOne(query);
      res.send((result));
    })

  }
  finally {

  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('running fruits server');
})

app.listen(port, () => {
  console.log('listening to port', port);
}
)