var beats = [];
var bpm = 0;
var ms = 0;
var hasBeenInitialized;

var addBeat = function(){
    var previousBeat = beats.slice(-1)[0];
    var date = new Date();
    
    var beat = {
        date: date, 
        diff: previousBeat ? (date - previousBeat.date) : 0
    }
    
    beats.push(beat);
}

var setSpeed = function(){
    var total = 0;
    
    if(beats.length > 3){
        beats = beats.slice(Math.max(beats.length - 3, 1));
    }
    
    for(var i = 0; i < beats.length; i++){
        total += beats[i].diff;
    }
    
    var calculatedBpm = Math.round(60000 * beats.length / total);

    if(isFinite(calculatedBpm) && calculatedBpm > 10){
        ms = (total / beats.length);
        bpm = Math.round(60000 * beats.length / total);
        document.getElementById("bpm").innerHTML = bpm.toString() + " BPM";
    }
}

var playBeat = function(){
    setTimeout(function(){
        var beat = new Audio('/beat.mp3');
        beat.play();
        playBeat();
    }, ms);
}

var registerInput = function(){
    addBeat();
    setSpeed();
    
    if(!hasBeenInitialized && ms !== 0){
        playBeat();
        hasBeenInitialized = true;
    }
}

window.addEventListener("keydown", registerInput, false);