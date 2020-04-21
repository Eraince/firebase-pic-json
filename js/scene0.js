let capture;
let radium, vogue, boulder, dash;
let faceCanvas;
let picTaken = false;
let facePic;
var storageRef = firebase.storage().ref();

let faceSketch = p => {
  p.preload = () => {
    radium = p.loadFont("../fonts/Radium-Corp.ttf");
    boulder = p.loadFont("../fonts/Boulder-Dash.ttf");
    vogue = p.loadFont("../fonts/Vogue.ttf");
    dash = p.loadFont("../fonts/dash_digital-7.ttf");
  };

  p.setup = () => {
    faceCanvas = p.createCanvas(p.windowWidth, p.windowHeight);
    capture = p.createCapture(p.VIDEO);
    capture.size(p.windowWidth, p.windowHeight);
    capture.position(0, 0);
    capture.hide();
  };

  p.draw = () => {
    p.background(0);
    let quadWidth = 400;
    let quadHeight = 300;
    let quadOffset = 100;
    let startX = 200;
    let startY = 200;
    if (!picTaken) {
      p.image(capture, 0, 0, p.windowWidth, p.windowHeight);
      // ---------------------------------------------------
      p.strokeWeight(3);
      p.stroke(51);
      p.rect(startX - quadOffset, startY + quadHeight + 30, 400, 50);
      p.textFont(radium);
      p.textSize(40);
      p.text("Do You Consent ?", startX, startY + quadHeight + 70);

      // -----------------------------------------------------
      p.strokeWeight(3);
      p.stroke(51);
      p.ellipse(p.width / 2, p.height / 2, 150, 150);
      p.textFont(vogue);
      p.textSize(40);
      p.text("Yes", p.width / 2 - 30, p.height / 2);

      // ---------------------------------------------

      p.strokeWeight(3);
      p.stroke(51);
      p.quad(
        startX,
        startY,
        startX - quadOffset,
        startY + quadHeight,
        startX + quadWidth - quadOffset,
        startY + quadHeight,
        startX + quadWidth,
        startY
      );
      p.textFont(dash);
      p.textSize(20);
      p.text("1. WEB CAMERA", startX + 50, startY + 50);
      p.text("ACESS ALLOWED", startX + 50, startY + 100);
      p.text("2. PAY FOR THE MEMORY", startX - 40, startY + 150);
      p.text("BY ( FACE )", startX, startY + 200);

      // -----------------------------------------------------
      p.strokeWeight(3);
      p.stroke(51);
      p.ellipse(p.width / 2 + 400, p.height / 2 + 200, 400, 150);
      p.textFont(vogue);
      p.textSize(15);
      p.text(
        "Use UP key to procedurally install memory",
        p.width / 2 + 250,
        p.height / 2 + 200
      );
    } else {
      p.clear();
      p.image(capture, 0, 0, p.windowWidth, p.windowHeight);
    }

    // ------------memory install station-----------
    p.strokeWeight(3);
    p.stroke(51);
    p.rect(10, 10, 400, 50);
    p.textFont(vogue);
    p.textSize(30);
    p.text("Memory Install Station", 30, 50);
  };

  p.mousePressed = () => {
    if (
      p.mouseX >= p.width / 2 - 75 &&
      p.mouseX <= p.width / 2 + 75 &&
      p.mouseY >= p.height / 2 - 75 &&
      p.mouseY <= p.height / 2 + 75 &&
      !picTaken
    ) {
      picTaken = true;
      setTimeout(() => {
        faceCanvas.canvas.toBlob(blob => {
          facePic = new Image();
          facePic.src = blob;
          let metadata = {
            contentType: "image/png"
          };
          storageRef
            .child("images/amy")
            .put(blob, metadata)
            .then(function(snapshot) {
              console.log("Uploaded", snapshot.totalBytes, "bytes.");
              window.location.href = "generate.html";
            })
            .catch(function(error) {
              console.error("Upload failed:", error);
            });
        });
      }, 500);
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

window.onload = function() {
  let face = this.document.querySelector("#faceContainer");
  new p5(faceSketch, face);
};
