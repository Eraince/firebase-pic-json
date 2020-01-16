(function() {
  // getting the canvas
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  resize();

  //drawing

  function resize() {
    ctx.canvas.width = window.innerWidth / 2;
    ctx.canvas.height = window.innerHeight;
  }

  let painting = false;
  window.addEventListener("resize", resize);
  document.addEventListener("mousemove", draw);
  document.addEventListener("mousedown", startPosition);
  document.addEventListener("mouseup", endPosition);

  var gradient = ctx.createLinearGradient(
    0,
    0,
    ctx.canvas.width / 2,
    ctx.canvas.height
  );
  gradient.addColorStop("0", "magenta");
  gradient.addColorStop("0.5", "blue");
  gradient.addColorStop("1.0", "red");

  // new position from mouse events
  function startPosition() {
    painting = true;
  }

  function endPosition() {
    painting = false;
    ctx.beginPath();
  }

  function draw(e) {
    if (!painting) return; // if mouse is pressed.....
    ctx.lineWidth = 5; // width of line
    ctx.lineCap = "round"; // rounded end cap
    ctx.strokeStyle = gradient;

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY); // to position
  }

  //get html elements
  var submitBtn = document.getElementById("submit");
  var name = document.getElementById("name");
  var title = document.getElementById("title");

  //create reference for firebase
  var db = firebase.firestore();
  var storageRef = firebase.storage().ref();

  //add event listener for button
  submitBtn.addEventListener("click", e => {
    var user = name.value;
    var picTitle = title.value;
    db.collection("users")
      .add({
        name: user,
        title: picTitle
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
    var full = user + picTitle;
    saveImage(full);
  });

  function saveImage(name) {
    canvas.toBlob(function(blob) {
      var image = new Image();
      image.src = blob;
      var metadata = {
        contentType: "image/png"
      };

      storageRef
        .child("images/" + name)
        .put(blob, metadata)
        .then(function(snapshot) {
          console.log("Uploaded", snapshot.totalBytes, "bytes.");
          window.location.href = "gallery.html";
        })
        .catch(function(error) {
          // [START onfailure]
          console.error("Upload failed:", error);
        });
    });
  }
})();
