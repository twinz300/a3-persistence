const { error } = require('console');
const express = require('express');
fs   = require( 'fs' );
mime = require( 'mime' ); 
require('dotenv').config();            
const { MongoClient, ServerApiVersion, Collection } = require('mongodb');
const jwt = require('jsonwebtoken');
const publicKey = process.env.MONGO_PUBLIC_KEY;
const privateKey = process.env.MONGO_PRIVATE_KEY;
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;


dir  = 'public/';
port = 3000;

app = express()
app.use( express.static('public')) //Allows "public" files to be accessed and utilized.
app.use (express.json())           // Allows "json" files to be accessed and utilized.


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let collection = null;

async function run() { //implement my new lines..........................!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    collection = await client.db("StudyScheduler").collection("Submissions");
  } finally {
    
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


//const appdata = [] //The app data I have starting out. (Should I edit. Answer. YES! Focus on mongodb)

                                 
app.get('/', (req, res) =>{ //Correct. Next.
  res.sendFile(__dirname + '/public/index.html')         //Sends index file to browser on request; Takes user to the homepage
  })                                                

app.get('/data', async (req, res) => { //Correct. Next.

  try{
    const data = await collection.find().toArray(); //this compiles all of the relevant data
    res.status(200).json(data);                          //Actually obtains the data for the user (success)
  }

  catch{ res.status(500).json({error: 'Unable to compile the relevant data.'});
   }})

 app.get('/docs', async (req, res) => {  //EXAMINE LIL FOE
   console.log('here...')
   if (collection !== null) {
     let docs = await collection.find({}).toArray();
     console.log(docs);
     res.json(docs);
   }
 })


app.post('/submit', async (req, res)=>{                               //handles Submit function
  
  const newSubmission = req.body
  
  const {yoursubject, yourday, yourdaystudyhours} = newSubmission;
  const dayStudyHours = parseFloat(yourdaystudyhours);

  if (!yoursubject || !yourday){
    return res.status(400).json({message: "The subject and day fields need to be filled in."})
  }

   const totalWeekHoursPenultimate = await collection.aggregate([{$group: {_id: null, total:{$sum: "$dayStudyHours"} }}]).toArray(); //this converts the above line to an array, making it easier to manipulate and integrate with mongodb

   const totalWeekHours = (totalWeekHoursPenultimate[0]?.total || 0) + dayStudyHours; 



     const newInformation = {
       'subject': yoursubject,
       'day': yourday,
       dayStudyHours,
       totalWeekHours,
     }

try
    {await collection.insertOne(newInformation); //inserts the new information & compiles it
      const data = await collection.find().toArray(); //NEW
      data.forEach(entry => (entry.totalWeekHours = totalWeekHours)) //NEW
  
  
      res.status(200).json(data)} //NEW
      
   // res.status(200).json(newInformation);}        //completes (successful) OG
  
catch {res.status(500).json({error: 'Unable to submit the new information.'})

  }})
  

  
  
  app.delete ('/delete', async (req, res) =>{                       //handles Delete function
   
    const {yoursubject, yourday, yourdaystudyhours} = req.body;
try {
  const finish = await collection.deleteOne({
    subject: yoursubject,
    day: yourday,
    dayStudyHours : parseFloat(yourdaystudyhours)
  })

  if(finish.deletedCount === 1){
    const totalWeekHours = (await collection.aggregate([{$group: {_id: null, total:{$sum: "$dayStudyHours"}}}]).toArray())[0]?.total ||0;
    
    const data = await collection.find().toArray();
    data.forEach(entry => (entry.totalWeekHours = totalWeekHours))


    res.status(200).json(data)
  }
  else {
    const data = await collection.find().toArray(); // WHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

    res.status(404).json({message: 'The entry could not be deleted. Reason: entry not found.',
      data //WHAATTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
    })

  }
}

catch {
  const data = await collection.find().toArray(); // WHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
  res.status(500).json({error: 'Cannot delete the entry.',
  data //WHAAAAAAAAAAAAAAAAATTTTTTTTTTTTTTTTTTTTTTTTTT
})} //everything below in this section is subject to change!!
 


})
   
    

    app.put('/modify', async (req, res) =>{                       //handles Modify function
      
      const {yoursubject, yourday, yourdaystudyhours, newsubject, newday, newdaystudyhours} = req.body
      //////
      if (!yoursubject || !yourday){ 
        return res.status(400).json({message: "The subject and day fields need to be filled in."})
      }

      if (!newsubject || !newday){ 
        return res.status(400).json({message: "The subject and day fields need to be filled in."})
      }
      
      try {

        const finish = await collection.updateOne({
          
          subject: yoursubject,
          day: yourday,
          dayStudyHours : parseFloat(yourdaystudyhours)},

          {
            $set: {
                      subject: newsubject || yoursubject,
                      day: newday || yourday,
                      dayStudyHours: parseFloat(newdaystudyhours) || parseFloat(yourdaystudyhours)

            }
          }
        )
          if(finish.modifiedCount ===1){
            const totalWeekHoursPenultimate = await collection.aggregate([{$group: {_id: null, total:{$sum: "$dayStudyHours"} }}]).toArray(); //this converts the above line to an array, making it easier to manipulate and integrate with mongodb

            const totalWeekHours = totalWeekHoursPenultimate[0]?.total || 0; 

            const data = await collection.find().toArray();
            data.forEach(entry => (entry.totalWeekHours = totalWeekHours));
            res.status(200).json(data)
          }
else {
  res.status(404).json({message: "Unable to find the desired entry."})
}
      }

catch {
  res.status(500).json({message: "Entry could not be modified"})
}
    })

    app.listen (process.env.PORT || 3000);
