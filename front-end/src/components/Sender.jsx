import { useEffect, useRef, useState } from "react";
import {v4 as uuidv4} from 'uuid';
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'pdfjs-dist/build/pdf.worker.min.mjs',
//     import.meta.url,
//   ).toString();
const Sender = () => {
    const [roomId, setRoomId] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const socketRef = useRef(null);
  
    useEffect(() => {
      // Connect to the WebSocket server
      socketRef.current = new WebSocket('ws://localhost:8080');
  
      // Handle socket close on component unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }, []);
  
    const generateRoomId = () => {
      const newRoomId = uuidv4();
      setRoomId(newRoomId);
  
      // Send joinRoom message to the server as a sender
      const joinMessage = JSON.stringify({ type: 'joinRoom', roomId: newRoomId, role: 'sender' });
      socketRef.current.send(joinMessage);
    };
  
    const handlePdfUpload = (e) => {
      setPdfFile(e.target.files[0]);
    };
  
    const broadcastPdf = () => {
      if (pdfFile && roomId) {
        const reader = new FileReader();
  
        // Read the file as ArrayBuffer for binary transmission
        reader.onload = function(event) {
          const fileData = event.target.result;
  
          // Prepare the message to be sent
          const message = {
            type: 'broadcastPdf',
            roomId: roomId,
            data: Array.from(new Uint8Array(fileData)), // Convert ArrayBuffer to a plain array for JSON compatibility
          };
  
          socketRef.current.send(JSON.stringify(message));
        };
  
        reader.readAsArrayBuffer(pdfFile);
      }
    };
  
    return (
      <div>
        <h1>PDF Broadcaster</h1>
        {!roomId ? (
          <button onClick={generateRoomId}>Generate Room ID</button>
        ) : (
          <div>
            <p>Room ID: {roomId}</p>
            <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
            <button onClick={broadcastPdf}>Broadcast PDF</button>
          </div>
        )}
      </div>
    );
  };
  export default Sender