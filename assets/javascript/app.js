$(document).ready(function () {

    var firebaseConfig = {
        apiKey: "AIzaSyAyublQNXrEqmgjaHeGpTAtlP5VTQSgvF8",
        authDomain: "train-scheduler-8cc7b.firebaseapp.com",
        databaseURL: "https://train-scheduler-8cc7b.firebaseio.com",
        projectId: "train-scheduler-8cc7b",
        storageBucket: "train-scheduler-8cc7b.appspot.com",
        messagingSenderId: "493256106022",
        appId: "1:493256106022:web:05283fd69da3d366"
    };

    // Initialize Firebase
    firebaseConfig.initializeApp(firebaseConfig);

    // Reference database
    var database = firebase.database();

    // Store inputs into variables
    var name = "";
    var destination = "";
    var time = "";
    var frequencey = 0;
    var timeFormat = "HH:mm"

    $("#addTrain").on("click", function (event) {
        name = $("#name").val().trim();
        destination = $("#destination").val().trim();
        time = $("#time").val().trim();
        frequency = $("frequency").val().trim();

        time = moment(time, timeFormat).format(timeFormat);

        // push data to db
        database.ref().push({
            name: name,
            destination: destination,
            time: time,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

    });

    database.ref().on("child_added", function (snapshot) {
        var sv = snapshot.val();

        // Variables for calculated display values
        var nextArrival = moment();
        var minutesAway = 0;

        // Determine minutes away and arrival time
        var firstTimeConverted = moment(sv.time, "HH:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        
        var remainder = diffTime % sv.frequency;

        minutesAway = sv.frequency - remainder;

        nextArrival = moment().add(minutesAway, "minutes");
        nextArrival = moment(nextArrival).format(timeFormat);

        // Populate HTML
        var row = $("<tr>");
        var rowHeader = $("<th scope='row'>");
        row.append(rowHeader);

        rowHeader.text(sv.name);

        var col1 = $("<td id='displayDestination'>");
        var col2 = $("<td id='displayFrequencyrequency'>");
        var col3 = $("<td id='next-arrival'>");
        var col4 = $("<td id='minutes-away'>");

        rowHeader.text(sv.name);
        col1.text(sv.destination);
        col2.text(sv.frequency);
        col3.text(nextArrival);
        col4.text(minutesAway);

        row.append(col1);
        row.append(col2);
        row.append(col3);
        row.append(col4);

        $("#displayResults").append(row);

    }, function (errorObject) {
        
    });

});

