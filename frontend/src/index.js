import PubSub from "pubsub-js";
import {upload} from "./uploader";
import Peer from 'peerjs';

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



q('#listen-button').addEventListener('click', function (){

    var lname = q('#listen-input').value;
    console.log("listen "+lname)
    var peer = new Peer(lname,{key: 'e4ddfhot38nkx1or'});
    peer.on('connection', function(conn) {
      console.log("listen connected "+lname)
      conn.on('data', function(data){
        // Will print 'hi!' 
        console.log(data);
      });
    });

    q('#send-button').addEventListener('click', function (){

      var name = q('#send-input').value;
      console.log("sending to "+name)
      var sconn = peer.connect(name);
      sconn.on('open', function(){
        sconn.send('hi '+name);
      });
    });
});



