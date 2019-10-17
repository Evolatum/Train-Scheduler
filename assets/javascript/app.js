var r="vwOW7H0"
var f="AIzaSyCb"
var t=["uSIn3","G8zgl"]
var config = {
    apiKey: `${f}-${"OBZW00T2QNVc"}${t[1]+t[0]}-${r}`,
    authDomain: "train-scheduler-e888b.firebaseapp.com",
    databaseURL: "https://train-scheduler-e888b.firebaseio.com",
    projectId: "train-scheduler-e888b",
    storageBucket: "train-scheduler-e888b.appspot.com",
    messagingSenderId: "1073749108220",
    appId: "1:1073749108220:web:324e01fc3bf006ffb3be79"
  }; 

  firebase.initializeApp(config);
  var database = firebase.database();
  var trainsRef = database.ref("/trains");

$("#addTrain").on("click", function(event) {
    event.preventDefault();

    trainsRef.push({
      name: $("#addName").val().trim(),
      destination: $("#addDestination").val().trim(),
      time: $("#addTime").val().trim(),
      freq: $("#addFreq").val().trim(),
    });

    $("#addName").val("");
    $("#addDestination").val("");
    $("#addTime").val("");
    $("#addFreq").val("");
});

trainsRef.on("child_added", function(snapshot) {
    var sv = snapshot.val();
    if(moment().diff(moment(sv.time, "HH:mm"),"minutes") > 0){
        var minutesAway = sv.freq - (moment().diff(moment(sv.time, "HH:mm"),"minutes") % sv.freq);
        var nextArrival = moment(moment().add(minutesAway,"minutes")).format("HH:mm");
    }else{
        var minutesAway = -moment().diff(moment(sv.time, "HH:mm"),"minutes") + 1;
        var nextArrival = sv.time;
    }

    $("#trainsHere").append(`
    <tr>
        <td>${sv.name}</td>
        <td>${sv.destination}</td>
        <td>${sv.freq}</td>
        <td>${nextArrival}</td>
        <td>${minutesAway}</td>
    </tr>`);
    
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});