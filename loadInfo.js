(function() {
  var db = firebase.firestore();
  var storageRef = firebase.storage().ref();
  var gallery = document.getElementById("gallery");
  //specify from which collection you're retrieving data
  db.collection("users")
    .get()
    .then(querySnapshot => {
      //querySnapshot is all the data from the collection
      querySnapshot.forEach(doc => {
        var name = doc.data().name;
        var title = doc.data().title;
        //construct the div to present data in html
        var signlePerson = document.createElement("div");
        signlePerson.className = "person";
        var info = document.createElement("p");
        info.innerText = "Name: " + name + " Title: " + title;
        signlePerson.append(info);
        // retrieve data from Storage by passing the path name of the image
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
