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
var trainName = $("#train-name");
var destName = $("#dest-name");
var firstTrain = $("#first-train");
var freq = $("#freq");

// verify inputs
trainName.blur(function() {
	//if trainName is empty
	if(trainName.val().trim() === '') {
		// remove any existing warnings
		$("#alert-name").remove("div");
		// set warning message & disable submit
		trainName.parent().append("<div class='alert alert-danger' id='alert-name' role='alert'>You must input the train's name.</div>");
		$("#submit").attr("disabled", true);
	} else {
		$("#alert-name").remove();
	};
});
destName.blur(function() {
	//if trainName is empty
	if(destName.val().trim() === '') {
		// remove any existing warnings
		$("#alert-dest").remove("div");
		// set warning message & disable submit
		destName.parent().append("<div class='alert alert-danger' id='alert-dest' role='alert'>You must input the train's destination.</div>");
		$("#submit").attr("disabled", true);
	} else {
		$("#alert-dest").remove();
	};
});
firstTrain.blur(function() {
	//if firstTrain is empty or if it doesnt match military time
	// setup military time checks
	if(firstTrain.val().trim().match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/) === null) {

		// remove any existing warnings
		$("#alert-first").remove("div");
		// set warning message & disable submit
		firstTrain.parent().append("<div class='alert alert-danger' id='alert-first' role='alert'>Input the train's first departure time in a valid military time. Ex: \"00:30\"</div>");
		$("#submit").attr("disabled", true);
	} else {
		$("#alert-first").remove();
	};
});
freq.blur(function() {
	//if firstTrain is empty or if it doesnt match military time
	var a = parseInt(freq.val().trim())
	if(!Number.isInteger(a)) {
		// remove any existing warnings
		$("#alert-freq").remove("div");
		// set warning message & disable submit
		freq.parent().append("<div class='alert alert-danger' id='alert-freq' role='alert'>Input the train's frequency of departure in minutes. Ex: \"45\"</div>");
		$("#submit").attr("disabled", true);
	} else {
		$("#alert-freq").remove();
	};
});

finalValidation();

$("input").keyup( function() {
	finalValidation();
});

function finalValidation () {
	// if inputs are empty, disable submit button
	if (trainName.val().trim() === '' || destName.val().trim() === '' ||	firstTrain.val().trim() === '' ||freq.val().trim() === ''  ) {
		$("#submit").attr("disabled", true);
	} else {
		$("#submit").attr("disabled", false);
	};
};

// when user hits submit, retrieve all input information
$("#submit").on("click", function(event) {

	// prevent submit from refreshing page
	event.preventDefault()

	// initialize variables with field inputs
	trainName = trainName.val().trim();
	destName = destName.val().trim();
	firstTrain = firstTrain.val().trim();
	freq = freq.val().trim();

	// new object to store all train info
	var trains = {
		name: trainName,
		dest: destName,
		first: firstTrain,
		freq: freq
	};

	// upload data to the database
	db.ref("/trains").push(trains);

	// clears text inputs
	$("#train-name").val("");
	$("#dest-name").val("");
	$("#first-train").val("");
	$("#freq").val("");
})

// when the database updates, update the screen array
db.ref("/trains").on("child_added", function (childSnapshot, prevChildKey) {
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

// Every minute, display time
function fn60sec() {
	var now = moment().format('HH:mm');
	$("#time").html(now);
	// store the updated time in firebase
	db.ref("/timer").set(now);

}
fn60sec();
setInterval(fn60sec, 60*1000);



