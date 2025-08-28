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

  return new Promise((resolve)=>{
    video.onloadedmetadata=()=>{
        resolve(video);
    }
  })
}
