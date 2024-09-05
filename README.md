Winston Lewis: 
This project shows ...

## Study Scheduler

My application allows users to schedule study sessions for the upcoming week. They can enter the subject they want to study, the day they want to study on, and the amount of hours they plan to study for. To submit, the user can click the “Submit” button once all three boxes have been filled with valid inputs. Once the user submits the relevant credentials, all submissions are immediately displayed to the user. The user can delete and modify prior submissions as well. To modify a submission, the user must enter the credentials of the submission they want to change across the middle set of boxes (exactly as originally typed), the changes they want to see across the last row of boxes, and click “Modify” when finished. To delete prior submissions, the user must enter the credentials of the submission they want to remove across the first row of boxes (exactly as originally typed), and click “Delete” when finished. There is a derived field that is also displayed, indicating the total amount of hours the user can expect to study during the specified week. The derived field adjusts when submissions are added, modified, or deleted. I used a CSS grid for positioning (see note below for more details).




**NOTE: Although I used a CSS grid for positioning, I did not use it for all elements. Instead, I used a CSS grid to format the displaying of the user’s submissions. I decided to design my application this way because I thought that it would make my webpage look nicer. Also, Prof. Charlie Roberts himself said that this was acceptable, and that I can receive full credit for doing so.** 

## Technical Achievements

**Created a single-page app:** 

My application displays the current and previous submissions that came from the user (i.e. subject, day of the week, anticipated study hours). Users also have the ability to delete their submissions. The derived field is the amount of hours expected to be studied throughout the whole week. This field is changed each time an entry is added or deleted. This was challenging because I had to find a way to make sure all submissions were displayed, not just the most recent submission. I also implemented all of my forms in a way that they would be shown on one page.


**Added the ability to modify existing data:**


With my application, users can modify existing data by typing the credentials of the submission they want to change in 3 boxes, typing the credentials of what they would like the submission changed to in a different set of boxes, and clicking the “Modify” button. This was challenging because I had to find a way to make sure the derived field changed accordingly, I had to make a separate request method for modifications, and I had to ensure all of my elements were properly capitalized. I also realized after conducting a test that this feature was dysfunctional due to the fact that I did not have unique ids for some of my elements. I corrected this by providing some of the ids that were reused with completely new ids.



## Design/UX Achievements

**Tested my interface (2 People):**


To thoroughly test my application, I asked my participants to: <br>
1. Schedule a study session. <br>
2. Schedule a second study session with different credentials. <br>
3. Modify one of the prior submissions. <br>
4. Delete one of the prior submissions. <br>


What was difficult about this process is that I was generally not allowed to give input about how to do each action I requested. I had to watch and hope that the users would be able to understand how to accomplish the goals based on the way I designed the webpage.

**Trial #1 (Crouse)**

Provide the last name of each student you conduct the evaluation with.

**The last name of the student involved in this evaluation is Crouse.**


What problems did the user have with your design?

**The user was unable to successfully modify a submission due to faulty coding.**


What comments did they make that surprised you?

**The user mentioned that he was bothered by the background color (yellow).**


What would you change about the interface based on their feedback?

**Based on the user’s feedback, I would change the coding regarding the “Modify” feature. (I ended up fixing this feature, and I made sure that it worked).**


**Trial #2 (Soofi)**

Provide the last name of each student you conduct the evaluation with.

**The last name of the student involved in this evaluation is Soofi.**


What problems did the user have with your design?

**The user noticed that negative study hours can be submitted, which should not be possible.**


What comments did they make that surprised you?

**The user did not make any surprising comments.**


What would you change about the interface based on their feedback?

**Based on the user’s feedback, I would remove the option to submit negative study hours.**
