console.log("leafEnding.js connected!");

const audio = new Audio("../music/rebelution.mp3");
audio.play();

/* let promise = audio.play();
if (promise) {
    //Older browsers may not return a promise, according to the MDN website
    promise.catch(function(error) { console.error(error); });
} */