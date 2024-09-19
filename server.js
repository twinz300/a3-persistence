const { error } = require('console');
const express = require('express');
const handie = require('express-handlebars').engine;
fs   = require( 'fs' );
mime = require( 'mime' ); 
cookie = require('cookie-session');

require('dotenv').config();            
const { MongoClient, ServerApiVersion, Collection } = require('mongodb');
const jwt = require('jsonwebtoken');
//const cookieParser = require("cookie-parser");

const publicKey = process.env.MONGO_PUBLIC_KEY;
const privateKey = process.env.MONGO_PRIVATE_KEY;
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const cookie1 = process.env.COOKIE_1;
const cookie2 = process.env.COOKIE_2;



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
let collectionOfUsernames; 

async function run() { 
  
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    collection = await client.db("StudyScheduler").collection("Submissions");
    collectionOfUsernames = await client.db("StudyScheduler").collection("username") 
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } 

run();

app.use( express.urlencoded({ extended:true }) )
app.use( express.json() )


//Login in code below...................................................
app.use(express.urlencoded({extended:true}))
app.use (cookie({
  name: 'session',
  keys: [cookie1, cookie2]
}))

app.post ('/login', async (req,res) => { //remove asynch
//console.log ('req.body')


const {username, password} = req.body      

if(username === '' || password === ''){ 

return res.redirect('/index.html?error=You must enter a username AND a password.');

// return res.status(400).json({error: "You must enter a username AND a password."}) //works
} 

try{ 
  const userAlreadyExists = await collectionOfUsernames.findOne({username}) 
if (userAlreadyExists){ 
  if(userAlreadyExists.password === password){ 
    req.session.username = username 
    req.session.user = username //XXX
    res.cookie("sessionId", req.sessionID) //XX
    req.session.login = true 
   // return res.redirect ('main.html') //was working previously
    return res.redirect(`/main.html?username=${username}`); //ooohhhh
  }
  else {
    //return res.status(401).json({error: "The password and username pair you have entered are incorrect."}) //TURN TO ALERT
    return res.redirect('/index.html?error=The password and username pair you have entered are incorrect.');
  }
}
else{
  await collectionOfUsernames.insertOne({username, password})
  req.session.username = username
  req.session.login = true
  res.cookie("sessionId", req.sessionID) //THIS IS BEING TESTED
 // return res.status(200).json({message: "Please remember this username and password, as you have just created an account."}) 

  return res.redirect(`/main.html?message=Please remember this username and password, as you have just created an account.&username=${username}`); //hoping
}
}
catch{
  console.error("Error: Could not log in successfully.")
  return res.status(500).json({Error: "Unable to login."})
}
})   

app.use ((req, res, next) => { //modified from example
if( req.session.login === true){
next();}
else {
res.sendFile(__dirname + '/public/index.html')
}

})
 
// app.get ('/user',(req, res) => { //BRING IT BACK IF IN DOUBT
//   console.log(req.session.username)
//   user = req.session.username
// if (req.session.username !== null){
//   res.send(JSON.stringify(user))
// }
// else {
//   res.status(400).json({message: "Invalid credentials."})
// }
// })
// app.get ('/user',(req, res) => {   
//   if(req.session.username){
//  const user = req.session.username
//  res.send(JSON.stringify(user))

// }

// else {
//   res.status(400).json({message: "Invalid credentials."})
// }
// })


app.get ('/user',(req, res) => {
     if(req.session.username){
    const user = req.session.username
    res.json({username: user})
  
   }
  
   else {
     res.status(400).json({message: "Invalid credentials."})
   }
   })


//Login in code above.............................................................................................







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

 app.get('/docs', async (req, res) => {  
console.log('Testing...')
  const username = req.session.username

  if (!username){
   return res.status(403).json({message: "Invalid action. You need to be logged in first."})
  }

   console.log('here...')
   if (collection !== null) {
     let docs = await collection.find({username}).toArray();
     console.log(docs);
     res.json(docs);
   }
 })


app.post('/submit', async (req, res)=>{                               //handles Submit function
  const username = req.session.username

  if (!username){
   return res.status(403).json({message: "Invalid action. You need to be logged in first."})
  }

  const newSubmission = req.body
  
  const {yoursubject, yourday, yourdaystudyhours} = newSubmission;
  const dayStudyHours = parseFloat(yourdaystudyhours);

  if (!yoursubject || !yourday){
    return res.status(400).json({message: "The subject and day fields need to be filled in."})
  }

   



     const newInformation = {
      username, //WATCH
       'subject': yoursubject,
       'day': yourday,
       dayStudyHours
      // totalWeekHours,
     }

try
    {
     await collection.insertOne(newInformation); //inserts the new information & compiles it
      const data = await collection.find({username}).toArray(); //WATCH
     
     
     
      // data.forEach(entry => (entry.totalWeekHours = totalWeekHours)) //NEW
  
  
     
      
    res.status(200).json(data); //used to be newInformation
    }        
  
catch {res.status(500).json({error: 'Unable to submit the new information.'})

  }})
  

  
  
  app.delete ('/delete', async (req, res) =>{                       //handles Delete function
   
    const username = req.session.username

    if (!username){
     return res.status(403).json({message: "Invalid action. You need to be logged in first."})
    }


    const {yoursubject, yourday, yourdaystudyhours} = req.body;
try {
  const finish = await collection.deleteOne({
    username,
    subject: yoursubject,
    day: yourday,
    dayStudyHours : parseFloat(yourdaystudyhours)
  })
console.log(finish.deletedCount + "Delete the count.")
  if(finish.deletedCount === 1){
  //  const totalWeekHours = (await collection.aggregate([{$group: {_id: null, total:{$sum: "$dayStudyHours"}}}]).toArray())[0]?.total ||0;
    
    const data = await collection.find({username}).toArray();
   // data.forEach(entry => (entry.totalWeekHours = totalWeekHours))


    res.status(200).json(data)
  }
   else {
  //   console.log("Watch here.")
   const data = await collection.find({username}).toArray(); 

  //   res.status(404).json(data)


   }
}

catch {
  const data = await collection.find({username}).toArray(); 
  res.status(500).json({error: 'Cannot delete the entry.',
  data 
})} 
 


})
   
    

    app.put('/modify', async (req, res) =>{                       //handles Modify function
      
      const username = req.session.username

      if (!username){
       return res.status(403).json({message: "Invalid action. You need to be logged in first."})
      }
      
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
          username,
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
          //  const totalWeekHoursPenultimate = await collection.aggregate([{$group: {_id: null, total:{$sum: "$dayStudyHours"} }}]).toArray(); //this converts the above line to an array, making it easier to manipulate and integrate with mongodb

        //    const totalWeekHours = totalWeekHoursPenultimate[0]?.total || 0; 

            const data = await collection.find({username}).toArray();
          //  data.forEach(entry => (entry.totalWeekHours = totalWeekHours));
            res.status(200).json(data)
          }
else {
  const data = await collection.find({username}).toArray(); 
  res.status(404).json(data) 
}
      }

catch {
  res.status(500).json({message: "Entry could not be modified"})
}
    })

    app.listen (process.env.PORT || 3000);
