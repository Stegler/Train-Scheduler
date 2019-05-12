var config = {
    apiKey: "AIzaSyB1LEMNMhG8d8lDUo9U_84nBiMHhVBEzNo",
    authDomain: "train-scheduler-2-e0406.firebaseapp.com",
    databaseURL: "https://train-scheduler-2-e0406.firebaseio.com",
    projectId: "train-scheduler-2-e0406",
    storageBucket: "train-scheduler-2-e0406.appspot.com",
    messagingSenderId: "985911997534",
    appId: "1:985911997534:web:af541869a893ee5d"
};
// Initialize Firebase
firebase.initializeApp(config);

// Reference database
var database = firebase.database();

$("#new-train").submit(function (event) {
    var trainName = $("#train-input").val();
    var destination = $("#destination-input").val();
    var startTime = $("#time-input").val();
    var frequency = $("#frequency-input").val();
    var trainSubmit = {
        name: trainName,
        destination: destination,
        start: startTime,
        frequency: frequency,
    };

    database.ref().push(trainSubmit);

    alert("You've successfully added a train to " + destination);

    $("#train-input").val();
    $("#destination-input").val();
    $("#time-input").val();
    $("#frequency-input").val();

    return false;
})

// Firebase event for adding the train information to the database and to the page
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    // Storing user info into a variable
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var startTime = childSnapshot.val().start;
    var frequency = childSnapshot.val().frequency;

    // Variables to generate real time data onto the page
    var convertedTime = moment(startTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var timeDiff = currentTime.diff(moment(convertedTime), "minutes");
    var remainingTime = timeDiff % frequency;
    var minutesTillTrain = frequency - remainingTime;
    var upcomingTrain = moment().add(remainingTime, "minutes");
    var formatTime = moment(upcomingTrain).format("HH:mm");

    $("#schedule-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + formatTime + "</td><td>" + minutesTillTrain + "</td></tr>");

});



