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

	
	// momentify dbFirst
	dbFirst = moment(dbFirst, "HH:mm");

 	//create a now variable 
 	var now = moment();

 	// calculate next time
	// var next_time = dbFirst.clone().add(dbFreq, 'm');

 	for (dbFirst; dbFirst < moment(); dbFirst.add(dbFreq, 'm')) {	
	};

	// calculate time left
	var timeLeft = dbFirst.diff(moment(), "m");

	//prettify times
	dbFirst = dbFirst.format("HH:mm").toString();
	timeLeft = timeLeft.toString();
	
	// Add db data to html table
	$("#train-table > tbody").append("<tr><td>" + dbName + "</td><td>" + dbDest + "</td><td>" + dbFreq + "</td><td>" + dbFirst + "</td><td>" + timeLeft + "</td></tr>");
})



