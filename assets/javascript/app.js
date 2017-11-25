  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD6ZSEjhvdJ15GxduYLIkcwJQsJoBXw2QM",
    authDomain: "trainscheduler-f8659.firebaseapp.com",
    databaseURL: "https://trainscheduler-f8659.firebaseio.com",
    projectId: "trainscheduler-f8659",
    storageBucket: "trainscheduler-f8659.appspot.com",
    messagingSenderId: "340460586891"
  };
  firebase.initializeApp(config);

// initlize variable for database
var db = firebase.database();

// declare variables
var trainName = "";
var destName = "";
var firstTrain = "";
var freq = "";

// when user hits submit, retrieve all input information
$("#submit").on("click", function(event) {
	// prevent submit from refreshing page
	event.preventDefault()
	// initialize variables with field inputs
	trainName = $("#train-name").val().trim();
	destName = $("#dest-name").val().trim();
	firstTrain = $("#first-train").val().trim();
	freq = $("#freq").val().trim();

	// log variables to console
	console.log("Local Var Train:" + trainName);
	console.log("Local Var Destination:" + destName);
	console.log("Local Var First Departure:" + firstTrain);
	console.log("Local Var Frequency:" + freq);

	// new object to store all train info
	var trains = {
		name: trainName,
		dest: destName,
		first: firstTrain,
		freq: freq
	};

	// upload data to the database
	db.ref().push(trains);

	// clears text inputs
	$("#train-name").val("");
	$("#dest-name").val("");
	$("#first-train").val("");
	$("#freq").val("");
})




// when the database updates, update the screen array
db.ref().on("child_added", function (childSnapshot, prevChildKey) {
	// store db data into variables
	var dbName = childSnapshot.val().name;
	var dbDest = childSnapshot.val().dest;
	var dbFirst = childSnapshot.val().first;
	var dbFreq = childSnapshot.val().freq;

	// log db variables to console
	console.log("Dabase Train:" + dbName);
	console.log("Dabase Destination:" + dbDest);
	console.log("Dabase First Departure:" + dbFirst);
	console.log("Dabase Frequency:" + dbFreq);
	
	// momentify dbFirst
	dbFirst = moment(dbFirst, "HH:mm");
 	console.log("dbFirst : " + dbFirst.toString());

 	//create a now variable 
 	var now = moment();
 	console.log("current time: " + now.toString());

 	// calculate next time
	var next_time = dbFirst.clone().add(dbFreq, 'm');
	console.log("next time: " + next_time.toString());

 	for (next_time; next_time < moment(); next_time.add(dbFreq, 'm')) {	
			console.log("LESS THAN - next_time : " + next_time.toString());
	};


	
	// calculate time left
	console.log("GREATER - next_time : " + next_time.toString());
	var timeLeft = next_time.diff(moment(), "m");
	console.log(timeLeft.toString());

	//prettify times
	next_time = next_time.format("HH:mm").toString();
	timeLeft = timeLeft.toString();

	console.log("pretty next arrival: " + next_time);
	console.log("pretty time left: " + timeLeft);

	
	// Add db data to html table
	$("#train-table > tbody").append("<tr><td>" + dbName + "</td><td>" + dbDest + "</td><td>" + dbFreq + "</td><td>" + next_time + "</td><td>" + timeLeft + "</td></tr>");
})



