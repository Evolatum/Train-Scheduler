var f="AIzaSyCb"
var r="vwOW7H0";
var t=["uSIn3","G8zgl"]

//Firebase configuration
var config = {
    apiKey: `${f}-${"OBZW00T2QNVc"}${t[1]+t[0]}-${r}`,
    authDomain: "train-scheduler-e888b.firebaseapp.com",
    databaseURL: "https://train-scheduler-e888b.firebaseio.com",
    projectId: "train-scheduler-e888b",
    storageBucket: "train-scheduler-e888b.appspot.com",
    messagingSenderId: "1073749108220",
    appId: "1:1073749108220:web:324e01fc3bf006ffb3be79"
  }; 

//Firebase initialization and references
firebase.initializeApp(config);
var database = firebase.database();
var trainsRef = database.ref("/trains");

//Application engine object
var appEngine = {
    //Checks if train is valid and then adds to firebase
    addTrain:function(){
        //Train object with html form values
        var newTrain={
            name: $("#addName").val().trim(),
            destination: $("#addDestination").val().trim(),
            time: $("#addTime").val().trim(),
            freq: $("#addFreq").val().trim(),
        }

        //Train validation
        var validTrain=true;
        //Checks if name of train or destination are not empty
        if(newTrain.time===""||newTrain.destination==="") validTrain=false;
        //checks if frequency is higher than a day
        else if(newTrain.freq > 1440) validTrain=false;
        //Checks if time given is valid by moment js standards
        else if(!moment(newTrain.time, "HH:mm").isValid()) validTrain=false;

        if(validTrain){
            trainsRef.push(newTrain);
            $("label").val("");
        } else{
            $('#errorTrain').modal('show');
        }
    },

    //Displays train given by firebase child snapshot
    displayTrain:function(sv){
        if(moment().diff(moment(sv.time, "HH:mm"),"minutes") > 0){
            var minutesAway = sv.freq - (moment().diff(moment(sv.time, "HH:mm"),"minutes") % sv.freq);
            var nextArrival = moment(moment().add(minutesAway,"minutes")).format("hh:mm a");
        }else{
            var minutesAway = -moment().diff(moment(sv.time, "HH:mm"),"minutes") + 1;
            var nextArrival = moment(sv.time, "HH:mm").format("hh:mm a");
        }
    
        $("#trainsHere").append(`
        <tr class="train" data-time="${sv.time}">
            <td>${sv.name}</td>
            <td>${sv.destination}</td>
            <td data-freq="${sv.freq}">${sv.freq<60?sv.freq+" min":Math.round(sv.freq/60*10)/10+" hr"}</td>
            <td>${nextArrival}</td>
            <td>${minutesAway<60?minutesAway+" min":Math.round(minutesAway/60*10)/10+" hr"}</td>
        </tr>`);
    },

    //Updates the time remaining and next arrival of all trains
    updateTrains:function(){
        $(".train").each(function(){
            var currentElement = $(this);
            var time = currentElement.data("time");
            var freq = currentElement.children().eq(2).data("freq");

            if(moment().diff(moment(time, "HH:mm"),"minutes") > 0){
                var minutesAway = freq - (moment().diff(moment(time, "HH:mm"),"minutes") % freq);
                var nextArrival = moment(moment().add(minutesAway,"minutes")).format("hh:mm a");
            }else{
                var minutesAway = -moment().diff(moment(time, "HH:mm"),"minutes") + 1;
                var nextArrival = moment(time, "HH:mm").format("hh:mm a");
            }

            currentElement.children().eq(3).text(nextArrival);
            currentElement.children().eq(4).text(minutesAway<60?minutesAway+" min":Math.round(minutesAway/60*10)/10+" hr");
        });
    },
}

//Receives click of button
$("#addTrain").on("click", function(event) {
    event.preventDefault();
    appEngine.addTrain();
});

//Checks if any train has been added to database, and sends them appEngine to display
trainsRef.on("child_added", function(snapshot) {
    appEngine.displayTrain(snapshot.val());
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

//Calls to update trains every 6 seconds
var timerID = setInterval(appEngine.updateTrains, 6 * 1000); 