const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bh4gk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db("digital-classroom");
        const usersCollection = database.collection("users");
        const classesCollection = database.collection("classes");
        const invitesCollection = database.collection("invites");

        //get users
        app.get('/users', async (req, res) => {

            const users = await usersCollection.find({});
            const addUsers = await users.toArray();
            res.send(addUsers)
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const classes = await usersCollection.findOne(query);
            res.send(classes)
        })

        //post users
        app.post('/users', async (req, res) => {

            const user = req.body;
            console.log(user)
            const result = await usersCollection.insertOne(user);
            res.json(result)
        })

        //get classes
        app.get('/classes', async (req, res) => {

            const classes = await classesCollection.find({});
            const addClasess = await classes.toArray();
            res.send(addClasess)
        })

        //get class with id
        app.get('/classes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const classes = await classesCollection.findOne(query);
            res.send(classes)
        })




        //post classes
        app.post('/classes', async (req, res) => {
            const classes = req.body;
            console.log(classes)
            const result = await classesCollection.insertOne(classes);
            res.json(result)
        })

        //get invites
        app.get('/invites', async (req, res) => {
            const invites = await invitesCollection.find({});
            const addInvites = await invites.toArray();
            res.send(addInvites)
        })


        //post invites
        app.post('/invites', async (req, res) => {
            const invites = req.body;
            console.log(invites)
            const result = await invitesCollection.insertOne(invites);
            res.json(result)
        })



    } finally {
        //await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Apartment Sales Website Server');
})

app.listen(port, () => {
    console.log('listening from: ', port);
})