    // more documentation available at
    // https://github.com/tensorflow/tfjs-models/tree/master/speech-commands

    // the link to your model provided by Teachable Machine export panel
    const URL = "https://speech-to-text.dopertjes.repl.co/model/";

    async function createModel() {
        const checkpointURL = URL + "model.json"; // model topology
        const metadataURL = URL + "metadata.json"; // model metadata

        const recognizer = speechCommands.create(
            "BROWSER_FFT", // fourier transform type, not useful to change
            undefined, // speech commands vocabulary feature, not useful for your models
            checkpointURL,
            metadataURL);

        // check that model and metadata are loaded via HTTPS requests.
        await recognizer.ensureModelLoaded();

        return recognizer;
    }

    async function init() {
        const recognizer = await createModel();
        const classLabels = recognizer.wordLabels(); // get class labels
        const labelContainer = document.getElementById("label-container");
        for (let i = 0; i < classLabels.length; i++) {
            labelContainer.appendChild(document.createElement("div"));
        }

        // listen() takes two arguments:
        // 1. A callback function that is invoked anytime a word is recognized.
        // 2. A configuration object with adjustable fields
        var hig;
        hig = [0,null];
        recognizer.listen(result => {
          hig = [0,null];
            const scores = result.scores; // probability of prediction for each class
            // render the probability scores per class
            for (let i = 0; i < classLabels.length; i++) {
                const s =  result.scores[i].toFixed(2)*100;
                if (s > hig[0] && classLabels[i] != 'Achtergrondruis' && s > 75) {
                  hig[0] = s;
                  hig[1] = classLabels[i];
                }
                document.getElementById('op').innerHTML = `<b>Result:</b> ${hig[1]} (${hig[0]}%)`;
                const classPrediction = classLabels[i] + ": " +s + "%";
                labelContainer.childNodes[i].innerHTML = classPrediction;
            }

        if (hig[1]) {
        var e;
        e = hig[1];
            if (!hig[1]) {
              e = 'null';
            } else {
              e = hig[1];
              e = e.toLowerCase();
            }
            var audio = new Audio(`./response/${e}.mp3`);
            audio.play();
        }
    

        }, {
            includeSpectrogram: true, // in case listen should return result.spectrogram
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
        });

        // Stop the recognition in 5 seconds.
        // setTimeout(() => recognizer.stopListening(), 5000);
    }