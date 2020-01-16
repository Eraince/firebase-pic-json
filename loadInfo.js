(function() {
  var db = firebase.firestore();
  var storageRef = firebase.storage().ref();
  var gallery = document.getElementById("gallery");
  db.collection("users")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        var name = doc.data().name;
        var title = doc.data().title;

        var signlePerson = document.createElement("div");
        signlePerson.className = "person";
        var info = document.createElement("p");
        info.innerText = "Name: " + name + " Title: " + title;

        signlePerson.append(info);

        storageRef
          .child("images/" + name + title)
          .getDownloadURL()
          .then(function(url) {
            var img = document.createElement("img");
            img.src = url;

            signlePerson.append(img);
          });
        gallery.append(signlePerson);
      });
    });
})();
