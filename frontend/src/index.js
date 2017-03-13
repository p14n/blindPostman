import PubSub from "pubsub-js";
import {upload} from "./uploader";

const q = (sel) => document.querySelector(sel);

q('.upload-btn').addEventListener('click', function (){

    q('#upload-input').click();
    q('.progress-bar').textContent = '0%';
    q('.progress-bar').style.width = '0%';

});

PubSub.subscribe('upload-progress',(msg,percentComplete) => {

  q('.progress-bar').textContent = percentComplete + '%';
  q('.progress-bar').style.width = percentComplete + '%';

  // once the upload reaches 100%, set the progress bar text to done
  if (percentComplete === 100) {
    q('.progress-bar').innerHTML = 'Done';
  }

});


q('#upload-input').addEventListener('change', function(){

  var files = this.files;
  upload(files);

});

