const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.port || 3001;
app.use(cors());
app.use(bodyParser.json());
const { MongoClient, ObjectID } = require('mongodb');
let db;

MongoClient.connect('mongodb://localhost:27017/todos', { useUnifiedTopology: true },  async (err, client) => {
  if (err) throw err
  db = client.db('todos');
  //await db.collection('todos').deleteMany();
});
//Home route

app.get('/', async(req, res) => {
  res.json('hello ?');
});


//todos route: for loading todos & creating them
app.route("/todos")
.get(async (req, res) => {
  const dblength = await db.collection('todos').countDocuments();
  console.log(dblength + " task to be completed :)");
  const todos = await db.collection('todos').find().toArray();
  res.json(todos);
  console.log('todos loaded from database! :)');
})
.post(async (req, res) => {
  await db.collection('todos').insertOne(req.body);
  res.json('posted');
  console.log(' todo created! ');
});
// specific todo : for delete and put
app.route("/todos/:id")
.delete(async (req, res) => {
  await db.collection('todos').deleteOne({ _id: ObjectID(req.params.id) });
  res.json('deleted');
  console.log('todo deleted :(');
})
.put(async (req, res) => {
  await db.collection('todos').replaceOne({ _id: ObjectID(req.params.id)}, req.body);
  res.json('putted');
  console.log('todo putted :/');
});
app.listen(port, (error) => {
   if(error) {
        console.log(error);
    }
 console.log(`Server running on port ${port}`);
});