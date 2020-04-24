let eyeCanvas, picCanvas;
let tracker;
let img = new Image();
var storageRef = firebase.storage().ref();
img.setAttribute("crossOrigin", "");

window.onload = function () {
  img.src =
    "https://firebasestorage.googleapis.com/v0/b/thisisatestfordrawing.appspot.com/o/images%2Famy?alt=media&token=ae5ad2cb-1f37-462d-b1f4-265c7a0f8e55";
  img.onload = function () {
    drawOnCanvas(this);
  };

  picCanvas = document.getElementById("selfie");
  eyeCanvas = document.getElementById("eyes");

  document.addEventListener(
    "keydown",
    (event) => {
      const code = event.keyCode;

      if (code === 38) {
        saveEye();
        window.location.href = "gallery.html";
      }
    },
    false
  );
};

const drawOnCanvas = (img) => {
  let startX, startY, targetWidth, targetHeight;

  let imgWidth = img.width * 0.3;
  let imgHeight = img.height * 0.3;
  picCanvas.width = imgWidth;
  picCanvas.height = imgHeight;
  let picCtx = picCanvas.getContext("2d");
  picCtx.imageSmoothingEnabled = false;
  picCtx.drawImage(img, 0, 0, imgWidth, imgHeight);
  tracker = new tracking.ObjectTracker(["eye"]);

  tracker.setStepSize(1.7);
  tracker.on("track", function (event) {
    if (event.data.length === 0) {
      console.log("nothing");
    }
    event.data.forEach(function (d) {
      startX = d.x;
      startY = d.y;
      targetWidth = d.width;
      targetHeight = d.height;
    });
  });
  tracking.track("#selfie", tracker);
  //   --------------------------------------------------------------------------
  let eyeData = picCtx.getImageData(startX, startY, targetWidth, targetHeight);

  eyeCanvas.width = targetWidth;
  eyeCanvas.height = targetHeight;
  let eyeCtx = eyeCanvas.getContext("2d");
  eyeCtx.putImageData(eyeData, 0, 0);
};

const saveEye = () => {
  eyeCanvas.toBlob((blob) => {
    eyePic = new Image();
    eyePic.src = blob;
    let metadata = {
      contentType: "image/png",
    };
    storageRef
      .child("images/eyes")
      .put(blob, metadata)
      .then(function (snapshot) {
        console.log("Uploaded", snapshot.totalBytes, "bytes.");
        // window.location.href = "generate.html";
      })
      .catch(function (error) {
        console.error("Upload failed:", error);
      });
  });
};
