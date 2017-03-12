import $ from 'jquery';
var AES = require("crypto-js/aes");

document.querySelector('.upload-btn').addEventListener('click', function (){

    document.querySelector('#upload-input').click();
    document.querySelector('.progress-bar').textContent = '0%';
    document.querySelector('.progress-bar').style.width = '0%';

});

document.querySelector('#upload-input').addEventListener('change', function(){

  var files = this.files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request

    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      var reader = new FileReader();

      reader.onload = function (e) {

        console.log(file)
        var encrypted = AES.encrypt(e.target.result, "password");
        var encryptedFile = new File([encrypted], file.name + '.encrypted', {type: "text/plain", lastModified: new Date()});

        // add the files to formData object for the data payload
        formData.append('uploads[]', encryptedFile, encryptedFile.name);

        $.ajax({
          url: '/upload',
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          success: function(data){
              console.log('upload successful!\n' + data);
          },
          xhr: function() {
            // create an XMLHttpRequest
            var xhr = new XMLHttpRequest();

            // listen to the 'progress' event
            xhr.upload.addEventListener('progress', function(evt) {

              if (evt.lengthComputable) {
                // calculate the percentage of upload completed
                var percentComplete = evt.loaded / evt.total;
                percentComplete = parseInt(percentComplete * 100);

                // update the Bootstrap progress bar with the new percentage
                document.querySelector('.progress-bar').textContent = percentComplete + '%';
                document.querySelector('.progress-bar').style.width = percentComplete + '%';

                // once the upload reaches 100%, set the progress bar text to done
                if (percentComplete === 100) {
                  document.querySelector('.progress-bar').innerHTML = 'Done';
                }

              }

            }, false);

            return xhr;
          }
        });

      }

      reader.readAsDataURL(file);

    }


  }
});