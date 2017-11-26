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
var trainNameField = $("#train-name");
var destNameField = $("#dest-name");
var firstTrainField = $("#first-train");
var freqField = $("#freq");

var trainNameText;
var destNameText;
var firstTrainText;
var freqText;

// verify inputs
trainNameField.blur(function() {
	trainNameText = $("#train-name").val().trim();
	//if trainName is empty
	if(trainNameText === '') {
		// remove any existing warnings
		$("#alert-name").remove("div");
		// set warning message & disable submit
		trainNameField.parent().append("<div class='alert alert-danger' id='alert-name' role='alert'>You must input the shuttle's name.</div>");
		$("#submit").attr("disabled", true);
	} else {
		$("#alert-name").remove();
	};
});
destNameField.blur(function() {
	destNameText = $("#dest-name").val().trim();
	//if trainName is empty
	if(destNameText === '') {
		// remove any existing warnings
		$("#alert-dest").remove("div");
		// set warning message & disable submit
		destNameField.parent().append("<div class='alert alert-danger' id='alert-dest' role='alert'>You must input the shuttle's destination.</div>");
		$("#submit").attr("disabled", true);
	} else {
		$("#alert-dest").remove();
	};
});
firstTrainField.blur(function() {
	firstTrainText = $("#first-train").val().trim();
	//if firstTrain is empty or if it doesnt match military time
	// setup military time checks
	if(firstTrainText.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/) === null) {

		// remove any existing warnings
		$("#alert-first").remove("div");
		// set warning message & disable submit
		firstTrainField.parent().append("<div class='alert alert-danger' id='alert-first' role='alert'>Input the shuttle's first departure time in a valid military time. Ex: \"00:30\"</div>");
		$("#submit").attr("disabled", true);
	} else {
		$("#alert-first").remove();
	};
});
freqField.blur(function() {
	freqText = $("#freq").val().trim();
	//if firstTrain is empty or if it doesnt match military time
	var a = parseInt(freqText)
	if(!Number.isInteger(a)) {
		// remove any existing warnings
		$("#alert-freq").remove("div");
		// set warning message & disable submit
		freqField.parent().append("<div class='alert alert-danger' id='alert-freq' role='alert'>Input the shuttle's frequency of departure in minutes. Ex: \"45\"</div>");
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
	if ($("#train-name").val().trim() === '' || $("#dest-name").val().trim() === '' || $("#first-train").val().trim() === '' || $("#freq").val().trim() === ''  ) {
		$("#submit").attr("disabled", true);
	} else {
		$("#submit").attr("disabled", false);
	};
};

// when user hits submit, retrieve all input information
$("#submit").on("click", function(event) {

	// prevent submit from refreshing page
	event.preventDefault()

	// new object to store all train info
	var trains = {
		name: trainNameText,
		dest: destNameText,
		first: firstTrainText,
		freq: freqText
	};

	// upload data to the database
	db.ref("/trains").push(trains);

	// clears text inputs
	$("#train-name").val("");
	$("#dest-name").val("");
	$("#first-train").val("");
	$("#freq").val("");
})

// initialize db variables
var dbName;
var dbDest;
var dbFirst;
var dbFreq;

var array = [];

// when the database updates, update the screen array
db.ref("/trains").on("child_added", function (childSnapshot, prevChildKey) {
	// store db data into variables
	dbName = childSnapshot.val().name;
	dbDest = childSnapshot.val().dest;
	dbFirst = childSnapshot.val().first;
	dbFreq = childSnapshot.val().freq;

	// push data to an array object
	array.push({"name": dbName, "dest": dbDest, "first": dbFirst, "freq": dbFreq},);
});

// when the database updates, update the screen array
db.ref("/trains").on("child_removed", function (childSnapshot, prevChildKey) {


	// store db data into variables
	dbName = childSnapshot.val().name;
	dbDest = childSnapshot.val().dest;
	dbFirst = childSnapshot.val().first;
	dbFreq = childSnapshot.val().freq;

	//get the index of the childSnapshot
	var removed = array.indexOf({"name": dbName, "dest": dbDest, "first": dbFirst, "freq": dbFreq});

	// push data to an array object
	array.splice(removed, 1);
});

// Every minute, display time
function fn60sec() {
	var now = moment().format('HH:mm');
	$("#time").html(now);
	// store the updated time in firebase
	db.ref("/timer").set(now);

}
fn60sec();
setInterval(fn60sec, 60*1000);

function render() {
	$("#train-table > tbody").empty();
	//as long as there are items in the array
	for (z = 0; z < array.length; z++) {	

		// momentify dbFirst
		objFirst = moment(array[z].first, "HH:mm");

	 	//create a now variable 
	 	var now = moment();

	 	// calculate next time
		var next_time = objFirst.clone().add(array[z].freq, 'm');

	 	for (objFirst; objFirst < moment(); objFirst.add(array[z].freq, 'm')) {	
		};

		// calculate time left
		var timeLeft = objFirst.diff(moment(), "m");

		//prettify times
		objFirst = objFirst.format("HH:mm").toString();
		timeLeft = timeLeft.toString();
		
		// Add db data to html table
		$("#train-table > tbody").append("<tr><td>" + array[z].name + "</td><td>" + array[z].dest + "</td><td>" + array[z].freq + "</td><td>" + objFirst + "</td><td>" + timeLeft + "</td></tr>");
	};
};


// when the database updates, update the screen array
db.ref().on("value", function (snap) {
	render();
});



