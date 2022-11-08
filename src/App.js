import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import camera from "./icons/camera.png"
import mic from "./icons/mic.png"
import phone from "./icons/phone.png"
import './App.css';

function App() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  let localStream =useRef(null)
  let remoteStream;

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id)
    });

    peer.on('call',async (call) => {
       localStream.current = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    await  localStream.current({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream)
        call.on('stream', function(remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream
          remoteVideoRef.current.play();
        });
      });
    })

    peerInstance.current = peer;
  }, [])

  const call = async(remotePeerId) => {
     remoteStream = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

   await remoteStream({ video: true, audio: true }, (mediaStream) => {

      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream)

      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream
        remoteVideoRef.current.play();
      });
    });
  }

  console.log(peerId)
  console.log("local : ",localStream.current)

  let toggleCamera=async()=>{ //toggling camera based on the current status
    let videoTrack=localStream.current.getTracks().find((track)=>track.kind==='video') 
    if(videoTrack.enabled){
        videoTrack.enabled=false
        document.getElementById("camera-btn").style.backgroundColor="rgb(255,80,80)"
    }else{
        videoTrack.enabled=true
        document.getElementById('camera-btn').style.backgroundColor='rgb(179,102,249,.9)'
    }
}

let toggleMic=async()=>{ //toggling mic  based on the current status.
    let audioTrack=localStream.current.getTracks().find((track)=>track.kind==='audio') 
    if(audioTrack.enabled){
        audioTrack.enabled=false
        document.getElementById("mic-btn").style.backgroundColor="rgb(255,80,80)"
    }else{
        audioTrack.enabled=true
        document.getElementById('mic-btn').style.backgroundColor='rgb(179,102,249,0.9)'
    }
}

  return (
    <div className="App">
      {/* <h1>Current user id is {peerId}</h1> */}
      <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>
     
      <div id='videos'>
      <div >
        <video  className='smallFrame' ref={currentUserVideoRef} />
      </div>
      <div>
        <video  className='video-player' ref={remoteVideoRef} />
      </div>
      </div>

    <div id="controls">
    <div class="control-container" id="camera-btn" onClick={toggleCamera}>
        <img src={camera} alt='camera' />
    </div>
    <div class="control-container" id="mic-btn" onClick={toggleMic}>
        <img src={mic} alt='mic' />
    </div>
    <div class="control-container" id="leave-btn">
        <img src={phone} alt='cut' />
    </div>
    
  </div>
    </div>
  );
}

export default App;