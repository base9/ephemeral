angular.module('radar')
.factory('PhotoFactory', ['HttpHandler', 'SharedProperties', function(Http, Shared) {

  var photoObj = {};

  var preview;
  var file;
  var reader;

  function makeHash(len){
    var text = [];
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(var i = 0; i < len; i++){
        text.push(possible.charAt(Math.floor(Math.random() * possible.length)));
    }
    return text.join('');
  }

  function uploadPhotoToServer(file, eventId) {
    var photoFileName = makeHash(18) + '.jpg';
    Http.uploadPhoto(file, photoFileName, eventId);
  }

  photoObj.getFile = function(){
      document.getElementById("upfile").click();
  }

  photoObj.previewFile = function() {
    preview = document.getElementsByClassName('photoPreview');
    preview = preview[preview.length-1];
    file = document.querySelector('input[type=file]').files[0];
    reader = new FileReader();

    reader.onloadend = function () {
      preview.src = reader.result;
    }

    if (file) {
      reader.readAsDataURL(file);
      if (Shared.getInEvent()) { uploadPhotoToServer(file, Shared.getEvent().id) }
      return file;
    } else {
      preview.src = "";
    }
  }

  photoObj.sub = function(obj){
     var file = obj.value;
     var fileName = file.split("\\");
     document.getElementById("addPhotoButton").innerHTML = fileName[fileName.length-1];
     document.myForm.submit();
     event.preventDefault();
  }

  return photoObj;
}]);

