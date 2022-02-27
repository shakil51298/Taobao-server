const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5055
app.use(cors())
app.use(bodyParser.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bptoi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const ProduictCollection = client.db("Product_Docs").collection("Products");
  const orderCollection = client.db("taobaoStore").collection("order");

  // adding product by uploading
  app.post('/addProducts', (req, res) => {
    const newProducts = req.body;
    ProduictCollection.insertOne(newProducts)
      .then(result => {
        // res.send(result.insertedCount > 0)
        res.redirect('/')
      })
  })

  app.get('/products', (req, res) => {
    ProduictCollection.find()
      .toArray((err, docs) => {
        res.send(docs)
      })



  })
  app.get('/product/:id', (req, res) => {
    const Pid = ObjectID(req.params.id);
    ProduictCollection.find({ _id: Pid })
      .toArray((err, docs) => {
        res.send(docs)
      })
  })

  app.delete('/delete/product/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    ProduictCollection.findOneAndDelete({ _id: id })
      .then(docs => {
        // console.log(docs);
        res.redirect('/')

      })
  })
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
        console.log(result);
      })
  })

  app.get('/orders', (req, res) => {
    const query = req.query.email;
    // console.log(query);
    orderCollection.find({ email: query })
      .toArray((err, doc) => {
        // console.log(doc);
        res.send(doc)
      })
  })
});





















// // save to mongo db
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
// client.connect(err => {
//   // console.log("connection err" , err);




app.get('/', (req, res) => {
  res.send('Hello shakil!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})