const config = {
  video: {
    width: 640, //That just tells the browser “display this video element at 640×480 pixels on screen”.
    height: 480,
    fps: 30,
  },
};

let videoWidth, videoHeight, drawingContext;

async function loadWebcam(width, height, fps) {
  //checks the web cam is enabled or not
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      "Browser API navigator.mediaDevices.getUserMedia is not available"
    );
  }

  let video = document.getElementById("webcam");
  if (!video) {
    throw new Error(
      "No <video> element with id='webcam' found in the document"
    );
  }

  // ✅ Configure video element
  video.muted = true;
  video.width = width;
  video.height = height;

  //mediaConfig only controls the stream coming from the camera, not how it’s shown in the HTML
  const mediaConfig = {
    audio: false,
    video: {
      facingMode: "user", // 'user' = front camera (for phones), 'environment' = back camera
      width: width,
      height: height,
      frameRate: { max: fps },
    },
  };

  const stream = await navigator.mediaDevices.getUserMedia(mediaConfig);
  video.srcObject = stream;

  // wait for the video stream to load enough to be ready to show
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}
async function loadVideo() {
  const video = await loadWebcam(
    config.video.width,
    config.video.height,
    config.video.fps
  );
  video.play();
  return video;
}
async function main() {
  let video = await loadVideo();

  //These are read-only properties that the browser fills in after the stream loads.
  //They tell you the real resolution coming from the webcam.
  videoWidth = video.videoWidth;
  videoHeight = video.videoHeight;

  canvas = document.getElementById("canvas");
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  drawingContext = canvas.getContext("2d"); //"2d" tells the browser: “I want to use 2D graphics (shapes, images, text, pixels, etc.) on this canvas.”
  drawingContext.clearRect(0, 0, videoWidth, videoHeight);

  drawingContext.fillStyle = "white";
  drawingContext.translate(canvas.width, 0);
  //This flips (mirrors) the drawing horizontally.
  drawingContext.scale(-1, 1); //flip horizontally (mirror left/right).

  drawingContext.drawImage(
    video,
    0,
    0,
    videoWidth,
    videoHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );
}
main();
