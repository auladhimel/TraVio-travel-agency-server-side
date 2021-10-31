const express = require('express')
const cors = require('cors')
require("dotenv").config()
const MongoClient=require("mongodb").MongoClient
const ObjectId=require("mongodb").ObjectId

const app = express()
const port = process.env.PORT||5000

// middleware
app.use(cors())
app.use(express.json())
// app.use(bodyParser.urlencoded({extended:true}));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tropq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri,
     { 
         useNewUrlParser: true, useUnifiedTopology: true
     });

console.log(uri)
async function run(){
    try{
        await client.connect();
        const database = client.db("travelpoka");
       const bookingsCollection = database.collection("bookings");
       //
       const blogsCollection = database.collection("blogs");
       //
       const galleryCollection = database.collection("gallery");
      //  
      const userBookingCollection=database.collection("userBooking");
      

        // get bookings
        app.get('/bookings', async(req,res)=>{
          const cursor= bookingsCollection.find({})
          const bookings=await cursor.toArray()
          res.send(bookings)
        })
        // get blogs
        app.get('/blogs', async(req,res)=>{
          const cursor= blogsCollection.find({})
          const blogs=await cursor.toArray()
          res.send(blogs)
        })
        // get gallery
        app.get('/gallery', async(req,res)=>{
          const cursor= galleryCollection.find({})
          const gallery=await cursor.toArray()
          res.send(gallery)
        })

        // post
        app.post('/bookings',(req,res)=>{
          // console.log(req.body)
          bookingsCollection.insertOne(req.body).then(result=>{
            res.send(result.insertedId);
          })
        })

          // get userbookings by email
          app.get('/userBooking/:email', async(req,res)=>{
            const cursor= userBookingCollection.find({email:req.params.email})
            const userBooking=await cursor.toArray()
            res.send(userBooking)
          })

          // get userbookings
          app.get('/userBooking', async(req,res)=>{
            const cursor= userBookingCollection.find({})
            const userBooking=await cursor.toArray()
            res.send(userBooking)
          })
      
       

        // post userbooking
        app.post('/userBooking/:id', (req,res)=>{
          userBookingCollection.insertOne(req.body)
          .then(result=>{
            res.send(result)
          })
        })

         // delete my order
         app.delete("/deleteMyorder/:id", async (req, res) => {
          console.log(req.params.id);
          const result=await userBookingCollection
          .deleteOne({ _id: ObjectId(req.params.id) })
          res.send(result)
        })

         // delete 
         app.delete("/deleteProduct/:id", async (req, res) => {
          console.log(req.params.id);
          const result=await bookingsCollection
          .deleteOne({ _id: ObjectId(req.params.id) })
          res.send(result)
        })

         // get single booking

          app.get("/singleBooking/:id", (req, res) => {
          console.log(req.params.id);
           bookingsCollection
          .findOne({ _id: ObjectId(req.params.id) })
          .then((result)=>{
            console.log(result)
            res.send(result)
          })
          
          });

          //update booking
            app.put("/update/:id", (req, res) => {
            const id = req.params.id;
            const updatedInfo = req.body;
            const filter = { _id: ObjectId(id) };
            bookingsCollection
            .updateOne(filter, {
            $set: {
              id:updatedInfo.id,
            name: updatedInfo.name,
            description: updatedInfo.description,
            price: updatedInfo.price,
            
            },
            })
            .then((result) => {
            res.send(result);
            });
            });

        
      


    }
    finally{}
}
run().catch(console.dir)

          



app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



