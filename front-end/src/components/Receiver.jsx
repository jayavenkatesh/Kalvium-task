// import React, { useState, useEffect, useRef } from 'react';
// import { Document, Page } from 'react-pdf';

// const Receiver = () => {
//   const [roomId, setRoomId] = useState('');
//   const [pdfFile, setPdfFile] = useState(null);
//   const socketRef = useRef(null);

//   const handleRoomIdChange = (e) => {
//     setRoomId(e.target.value);
//   };

//   const joinRoom = () => {
//     if (roomId) {
//       // Send joinRoom message to the server as a receiver
//       const joinMessage = JSON.stringify({ type: 'joinRoom', roomId, role: 'receiver' });
//       socketRef.current.send(joinMessage);
//     }
//   };

//   useEffect(() => {
//     // Connect to the WebSocket server
//     socketRef.current = new WebSocket('ws://localhost:8080');

//     // Handle incoming WebSocket messages
//     socketRef.current.onmessage = (event) => {
//       const message = JSON.parse(event.data);

//       switch (message.type) {
//         case 'success':
//           // Do nothing, since the server won't send a success message to receivers
//           break;
//         case 'broadcastPdf':
//           // Convert the binary data to a Blob and create a URL for the PDF
//           const pdfBlob = new Blob(message.data, { type: 'application/pdf' });
//           const pdfUrl = URL.createObjectURL(pdfBlob);
//           setPdfFile(pdfUrl);
//           break;
//         default:
//           console.error('Unknown message type:', message.type);
//       }
//     };

//     // Clean up the socket connection on component unmount
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.close();
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <h1>PDF Receiver</h1>
//       <input
//         type="text"
//         placeholder="Enter Room ID"
//         value={roomId}
//         onChange={handleRoomIdChange}
//       />
//       <button onClick={joinRoom}>Join Room</button>
//       {pdfFile && (
//         <Document file={pdfFile}>
//           <Page pageNumber={1} />
//         </Document>
//       )}
//     </div>
//   );
// };

// export default Receiver;

import React, { useState, useEffect, useRef } from 'react';
import { Document, Page,pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
const Receiver = () => {
  const [roomId, setRoomId] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const socketRef = useRef(null);

  const handleRoomIdChange = (e) => {
    setRoomId(e.target.value);
  };

  const joinRoom = () => {
    if (roomId) {
      // Send joinRoom message to the server as a receiver
      const joinMessage = JSON.stringify({ type: 'joinRoom', roomId, role: 'receiver' });
      socketRef.current.send(joinMessage);
    }
  };

  useEffect(() => {
    // Connect to the WebSocket server
    socketRef.current = new WebSocket('ws://localhost:8080');

    // Handle incoming WebSocket messages
    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'success':
          // Do nothing, since the server won't send a success message to receivers
          break;
        case 'broadcastPdf':
          // Convert the binary data to a Blob and create a URL for the PDF
          const pdfBlob = new Blob(message.data, { type: 'application/pdf' });
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setPdfFile(pdfUrl);
          break;
        default:
          console.error('Unknown message type:', message.type);
      }
    };

    // Clean up the socket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <h1>PDF Receiver</h1>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={handleRoomIdChange}
      />
      <button onClick={joinRoom}>Join Room</button>
      {pdfFile && (
        <Document file={pdfFile}>
          <Page pageNumber={1} />
        </Document>
      )}
    </div>
  );
};

export default Receiver;