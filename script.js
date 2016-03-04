(function() {
    var beats = [];
    var bpm = 0;
    var ms = 0;
    var hasBeenInitialized;
    var context = new AudioContext();
    var beatBuffer;

    function loadBeat() {
        var request = new XMLHttpRequest();
        request.open("GET", "/beat.mp3", true);
        request.responseType = "arraybuffer";

        request.onload = function() {
            context.decodeAudioData(request.response, function(buffer) {
                beatBuffer = buffer;
            });
        }
        request.send();
    }
    loadBeat();

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

        if(isFinite(calculatedBpm)){
            ms = (total / beats.length);
            bpm = calculatedBpm;
            document.getElementById("bpm").innerHTML = bpm.toString() + " BPM";
        }
    }

    var playBeat = function(){
        setTimeout(function(){
            var source = context.createBufferSource();
            source.buffer = beatBuffer;
            source.connect(context.destination);
            source.start(0);
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
})();
