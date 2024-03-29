
  var firebaseConfig = {
    apiKey: "AIzaSyDzt8c4lw8wcLDSVFl-6rtKiTash7ifmrc",
    authDomain: "train-schedule-2e3dc.firebaseapp.com",
    databaseURL: "https://train-schedule-2e3dc.firebaseio.com",
    projectId: "train-schedule-2e3dc",
    storageBucket: "",
    messagingSenderId: "22234897843",
    appId: "1:22234897843:web:7ca2e43e27d6d837"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

  $("#submit").on('click', function(event){
    event.preventDefault();

    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstDeparture = $("#first-departure").val().trim();
    var frequency = $("#frequency").val().trim();
    
    var newTrain = {
      name: trainName,
      destination: destination,
      departure: firstDeparture,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    }

    database.ref().push(newTrain);

    alert("congratulations. new train added succesfully.")

    $("#train-name").val("");
    $("#destination").val("");
    $("#first-departure").val("");
    $("#frequency").val("");

  });

  database.ref().on("child_added", function(snapshot) {

    console.log(snapshot.val());

      var tFrequency = snapshot.val().frequency;
      var firstDeparture = snapshot.val().departure;

      var firstTimeConverted = moment(firstDeparture, "HH:mm").subtract(1, "years");

      var timeDifference = moment().diff(moment(firstTimeConverted), "minutes");

      var timeRemainder = timeDifference % tFrequency;

      var nextArrival = tFrequency - timeRemainder;

      var nextTrain = moment().add(nextArrival, "minutes");

      var newRow = $("<tr>").append(
       $("<td>").text(snapshot.val().name),
       $("<td>").text(snapshot.val().destination),
       $("<td>").text(snapshot.val().frequency + " min."),
       $("<td>").text(moment(nextTrain).format('h:mm a, MMMM Do')),
       $("<td>").text(nextArrival + " min. away")
      );
  
      $("#train-info").append(newRow);
   
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });
