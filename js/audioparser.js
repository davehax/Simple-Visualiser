// Audio parser
let AudioParser = function () {
    let audioCtx = null;
    let audio = null;
    
    this.Clear = () => {
        // Stop the audio playing and mark audio for Garbage Collection
        if (audio !== null) {
            audio.pause();
            audio = null;
        }

        // Close the AudioContext to prevent multiple context connections being maintained
        // and mark audioCtx for Garbage Collection
        if (audioCtx !== null) {
            audioCtx.close();
            audioCtx = null;
        }
    }

    this.Parse = (dataUrl, blockCount, callback) => {
        // Clean things up before starting again
        this.Clear();
        // Using the AudioContext object
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // Create a new Audio object
        audio = new Audio();
        audio.crossOrigin = "anonymous"; // while testing locally, i guess? Maybe it's required when hosted as well

        // Set the Audio objects src
        audio.src = event.srcElement.result;

        
        // Create a source and an analyser. The analyser gives us freq data
        let source = audioCtx.createMediaElementSource(audio);
        let analyser = audioCtx.createAnalyser();
        analyser.fftSize = fftSize;
        // Connect the source to the analyser
        source.connect(analyser);
        // Connect the analyser to the destination (output)
        analyser.connect(audioCtx.destination);

        // Play the audio
        audio.play();
        
        let bufferLength = analyser.fftSize;
        let dataArray = new Uint8Array(bufferLength);

        let getFreqData = () => {
            analyser.getByteFrequencyData(dataArray);
            let blocks = [];

            // group data into blocks of <blockCount>
            for (let i = 0; i < blockCount; i++) {
                let start = i * blockSize;
                let total = 0;

                for (let j = 0; j < blockSize; j++) {
                    total += dataArray[start + j];
                }

                total = Math.round(total / blockSize); // rounded average
                blocks[i] = total;
            }

            callback(blocks, audio.currentTime, audio.duration);
            // renderer.Draw(blocks, audio.currentTime, audio.duration);
            if (audio !== null && !audio.paused) {
                requestAnimationFrame(getFreqData);
            }
        }

        requestAnimationFrame(getFreqData);
    }

    return this;
}

window.AudioParser = AudioParser;