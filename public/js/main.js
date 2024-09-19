// FRONT-END (CLIENT) JAVASCRIPT HERE
//-------------------------------------------- display below
const renderData = function (data){
  const displayArea = document.querySelector('#dataDisplay')
  displayArea.innerHTML = ''

console.log(data)

  if(Array.isArray(data)){

    console.log("Data is array"+ data)
data.forEach(entry => {

const entryDiv = document.createElement('div')
entryDiv.classList.add('grid-item') //this the new one
entryDiv.innerHTML = 
`<div> Subject: ${entry.subject},</div> <div> Day: ${entry.day},</div> <div> Hours: ${entry.dayStudyHours}</div>`
displayArea.appendChild(entryDiv)
})

}
else {
  console.error('Invalid data.') //FIX THIS ELSE STATEMENT

}


}

//-------------------------------------------------------------------display above










const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const subjectChosen = document.querySelector ( '#yoursubject' ).value
  const dayChosen = document.querySelector ( '#yourday' ).value
  const daystudyHoursChosen =  document.querySelector ( '#daystudyhours' ).value

  console.log('Submitting: ', {subjectChosen, dayChosen, daystudyHoursChosen}); //remove when done


  if (subjectChosen != "input subject here" && dayChosen != "input day here" && (daystudyHoursChosen > 0 && daystudyHoursChosen <= 24)) {
  
  
    const response = await fetch( '/submit', {
    method:'POST',
    headers: {'Content-Type': 'application/json',
     },
    body: JSON.stringify({ 
      yoursubject: subjectChosen, 
      yourday: dayChosen,
      yourdaystudyhours: daystudyHoursChosen
    
    })

  })

  
  const data = await response.json()
  console.log( 'Submit response:', data)
  renderData(data)
}
}
const deleteSubmission = async function (event){
  event.preventDefault()

  const subjectChosen = document.querySelector ( '#yoursubject' ).value
  const dayChosen = document.querySelector ( '#yourday' ).value
  const daystudyHoursChosen =  document.querySelector ( '#daystudyhours' ).value
       
  const response = await fetch( '/delete', {
    method:'DELETE',
    headers: {'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      yoursubject: subjectChosen, 
      yourday: dayChosen,
      yourdaystudyhours: daystudyHoursChosen
    
    })
  })

   const data = await response.json()
   console.log( 'Delete response:', data)
   renderData(data)
  
 

 
}

//--------------------MOD below
const modifySubmission = async function (event){
  event.preventDefault()

  const subjectChosen = document.querySelector ( '#modsubject' ).value
  const dayChosen = document.querySelector ( '#modday' ).value
  const dayStudyHoursChosen =  document.querySelector ( '#moddaystudyhours' ).value

  const newSubjectChosen = document.querySelector ( '#newsubject' ).value
  const newDayChosen = document.querySelector ( '#newday' ).value
  const newDayStudyHoursChosen =  document.querySelector ( '#newdaystudyhours' ).value

       

      if (newSubjectChosen != "input new subject here" && newDayChosen != "input new day here" && (newDayStudyHoursChosen > 0 && newDayStudyHoursChosen <= 24)
          && subjectChosen != "" && dayChosen != "") {
  const response = await fetch( '/modify', {
    method:'PUT',
    headers: {'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      yoursubject: subjectChosen, 
     yourday: dayChosen,
      yourdaystudyhours: dayStudyHoursChosen,
      newsubject: newSubjectChosen,
      newday: newDayChosen,
      newdaystudyhours: newDayStudyHoursChosen

    
    })
  })
  const data = await response.json()
  console.log( 'Modify response:', data)
  renderData(data)
}

}
//--------------------MOD above

const getData = async () => {
 const response = await fetch('/docs', {method: 'GET'})
 const data = await response.json()
 console.log('Fetched data on page load:', data); //FIX EDIT ...........................
 renderData(data)
}

// const getUser = async () => { //whole function is new       PUT IT BACK MAN
//   console.log('Getting user')
//   const response = await fetch('/user', {method: 'GET'})
//   console.log("Response: " + response)
// document.getElementById(username).innerHTML = response
// }

const getUser = async () => {  //ORIGIN (BYE BYE)
  console.log('Getting user');

try {
  const response = await fetch('/user', {method: 'GET'})

if (response.ok){
  const data = await response.json();
  console.log("User data: ", username)
  document.getElementById('username').innerHTML = `User: ${data.username}`

  //new section starts here;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
const sections = new URLSearchParams(window.location.search)
const message = sections.get('message')
if (message) {
  document.getElementById('message').innerText = message;
}

  //new section ends here''''''''''''''''''''''''''''''''''''''''''''''
}
else{
  console.error("Failed to obtain username.")
// window.location.href = '/index.html' //CAREFUL, BRODIE........................................
}
}
catch {
  console.error("Error: Could not obtain username")
}


}

//window.onload = getUser; //newwwwwwwwwwwwwwwwwwwwwwwwws
window.onload = function() {
   document.querySelector('#submissionbutton').onclick=submit   
   document.querySelector('#deletebutton').onclick=deleteSubmission
   document.querySelector('#modifybutton').onclick=modifySubmission
   console.log('Getting user');
   getUser(); //??? revert if needed
   getData(); 
 // fetchData()                                           //REVERT???
}