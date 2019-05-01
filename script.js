(function() {
  var db = firebase.firestore();
  var storageRef = firebase.storage().ref();

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0, 0, 150, 75);
  ctx.beginPath();
  ctx.arc(100, 75, 50, 0, 2 * Math.PI);
  ctx.stroke();

  var submitBtn = document.getElementById("submit");
  var firstName = document.getElementById("firstname");
  var lastName = document.getElementById("lastname");

  submitBtn.addEventListener("click", e => {
    var first = firstName.value;
    var last = lastName.value;
    db.collection("users")
      .add({
        first: first,
        last: last
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
    var fullName = first + last;
    saveImage(fullName);
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
          //   window.location.href = "gallery.html";
        })
        .catch(function(error) {
          // [START onfailure]
          console.error("Upload failed:", error);
        });
    });
  }
})();
