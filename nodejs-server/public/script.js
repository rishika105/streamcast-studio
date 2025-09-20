const userVideo = document.getElementById("user-video");
const startButton = document.getElementById("start-btn");

const state = { media: null };
const socket = io();

startButton.addEventListener("click", async (e) => {
  //cant send the video to server using tcp directly we need to convert to binary
  //binary data -> socket server

  //record the data
  const mediaRecorder = new MediaRecorder(state.media, {
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 2500000,
    framerate: 25,
  });

  mediaRecorder.ondataavailable = (ev) => {
    // console.log("binary stream available", ev.data);
    socket.emit('binarystream', ev.data); //send 
  };

  mediaRecorder.start(25);
});

window.addEventListener("load", async (e) => {
  const media = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  state.media = media; //save the video in state
  userVideo.srcObject = media;
});
