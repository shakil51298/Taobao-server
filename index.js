const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bptoi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()
const port = 5055

app.use(cors())
app.use(bodyParser.json())

// save to mongo db
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  // console.log("connection err" , err);
  const ProduictCollection = client.db("Product_Docs").collection("Products");
  
  // adding product by uploading
  app.post('/addProducts', (req, res) => {
    const newProducts = req.body;
    console.log('adding new event: ', newProducts)
    ProduictCollection.insertOne(newProducts)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/products' , (req ,res ) => {
      ProduictCollection.find()
      .toArray((err , docs) =>{
        console.log(docs);
        res.send(docs)
      })
  })
  app.get('/product/:id' , (req ,res ) => {
      const Pid  = ObjectID(req.params.id);
      ProduictCollection.find({_id : Pid})
      .toArray((err , docs) =>{
        res.send(docs)
      })
  })

  app.delete('/delete/product/:id' , (req , res)=>{
    const id = ObjectID(req.params.id)
    ProduictCollection.findOneAndDelete({_id: id})
    .then(docs => {
      console.log(docs);
      res.send(docs)
    })
  })
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})