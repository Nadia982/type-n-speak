//Initialise SppechSythesis API
const synth = window.speechSynthesis;

//Fetching DOM elements
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const body = document.querySelector("body");

//Initialise the voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();
  //Loop through voices and create an option for each one
  voices.forEach((voice) => {
    //Create option element for each voice
    const option = document.createElement("option");
    //Fill option with voice and language
    option.textContent = voice.lang + " (" + voice.name + ")";
    //Set required option attributes
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    voiceSelect.appendChild(option);
    option.style.fontSize = "0.9rem";
  });
};

getVoices();

//the following code is required in order to get the voices.
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

//Speak
const speak = () => {
  //Check if already speaking
  if (synth.speaking) {
    console.error("Already speaking...");
    return;
  }
  if (textInput.value !== "") {
    //Add background animation
    body.style.background = "#040404 url(img/wave.gif)";
    body.style.backgroundRepeat = "repeat-x";
    body.style.backgroundSize = "100% 100%";

    //Get text to speak
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    //Speak end
    speakText.onend = (e) => {
      console.log("Finished speaking");
      body.style.background = "#040404"
    };
    //Speak error
    speakText.onerror = (e) => {
      console.error("Something went wrong");
    };
    //Determining which voice to use to speak
    const selectedVoice =
      voiceSelect.selectedOptions[0].getAttribute("data-name");
    console.log(selectedVoice);

    //loop through the voices and if the current iteration matches what we selected then use that voice
    voices.forEach((voice) => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    //Set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    //Speak
    synth.speak(speakText);
  }
};

//Event listeners
// Text form submission
textForm.addEventListener("submit", (e) => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// Rate value change
rate.addEventListener("change", (e) => (rateValue.textContent = rate.value));
pitch.addEventListener("change", (e) => (pitchValue.textContent = pitch.value));

//Voice select change
voiceSelect.addEventListener("change", (e) => speak());
