(function() {
  var db = firebase.firestore();
  var storageRef = firebase.storage().ref();
  var gallery = document.getElementById("gallery");
  db.collection("users")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        var first = doc.data().first;
        var last = doc.data().last;
        var full = first + last;

        var signlePerson = document.createElement("div");
        var info = document.createElement("p");
        info.innerText = "Firstname: " + first + "  Lastname: " + last;
        signlePerson.append(info);
        gallery.append(signlePerson);
        storageRef
          .child("images/" + full)
          .getDownloadURL()
          .then(function(url) {
            var img = document.createElement("img");
            img.src = url;

            gallery.append(img);
          });
      });
    });
})();
