const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you're testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000
// everything above is perfect!
const appdata = [ //appdata should have examples of what i expect to EVENTUALLY be entered
]

const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  }else if( request.method === 'POST' ){
    handlePost( request, response ) 
  }
  else if( request.method === 'DELETE' ){
    handleDelete( request, response ) 
  }
  else if (request.method === 'PUT'){
    handlePut (request, response)
  }

})

const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
  }else if(request.url === '/data'){
    response.writeHeader( 200, "OK", {'Content-Type': 'application/json' }) 
    response.end(JSON.stringify(appdata));
  }
  else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {
    const newSubmission = ( JSON.parse( dataString ) )

    //CHECK PROP NAMES
    const subject = newSubmission.yoursubject
    const day = newSubmission.yourday
    const dayStudyHours = parseFloat(newSubmission.yourdaystudyhours)

    // ... do something with the data here!!!
    // I've decided to add the new submission to the previously established "appdata" model
    //adding the "derived field" here

    const totalWeekHours = appdata.reduce((sum, note) => sum + note.dayStudyHours, 0) + dayStudyHours
    
    appdata.push({
      'subject': subject,
      'day': day,
      'dayStudyHours': dayStudyHours,
      'totalWeekHours': totalWeekHours,
    })

    response.writeHeader( 200, "OK", {'Content-Type': 'application/json' }) 
    response.end(JSON.stringify(appdata))
  })
}

const handleDelete = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

request.on( 'end', function() {
const deleteEntry = JSON.parse(dataString)
const index = appdata.findIndex(entry=>
  entry.subject === deleteEntry.yoursubject &&
  entry.day === deleteEntry.yourday &&
  entry.dayStudyHours === parseFloat(deleteEntry.yourdaystudyhours) 
)

if (index !== -1){
  appdata.splice(index, 1)

  const totalWeekHours = appdata.reduce((sum, note) => sum + note.dayStudyHours, 0)
  appdata.forEach(note => note.totalWeekHours = totalWeekHours)

  response.writeHeader( 200, "OK", {'Content-Type': 'application/json' }) 
    response.end(JSON.stringify(appdata))
}

else{
  response.writeHeader(404, "Error present", {'Content-Type': 'application/json'})
  response.end(JSON.stringify(appdata))
}

})
}
//----------------------------------------------------handlePut below
const handlePut = function( request, response ) {
  let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

request.on( 'end', function() {
const modifyEntry = JSON.parse(dataString)
const {yoursubject, yourday, yourdaystudyhours, newsubject, newday, newdaystudyhours} = modifyEntry //fix
const index = appdata.findIndex(entry=>
  entry.subject === yoursubject &&
  entry.day === yourday &&
  entry.dayStudyHours === parseFloat(yourdaystudyhours) 
)

if (index !== -1){
  if (newsubject) appdata[index].subject = newsubject
  if (newday) appdata[index].day = newday
  if (newdaystudyhours) appdata[index].dayStudyHours = parseFloat(newdaystudyhours)

  const totalWeekHours = appdata.reduce((sum, note) => sum + note.dayStudyHours, 0)
  appdata.forEach(note => note.totalWeekHours = totalWeekHours)

  response.writeHeader( 200, "OK", {'Content-Type': 'application/json' }) 
    response.end(JSON.stringify(appdata))
}

else{
  response.writeHeader(404, "Error present", {'Content-Type': 'application/json'})
  response.end(JSON.stringify(appdata))
}

})
}
//------------------------------------------------------------------------------handlePut above
const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen( process.env.PORT || port )
