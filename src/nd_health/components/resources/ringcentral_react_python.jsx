// 📁 /frontend/src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { WebPhone } from '@ringcentral/web-phone';

function App() {
  const [toNumber, setToNumber] = useState('');
  const [status, setStatus] = useState('Idle');
  const webPhoneRef = useRef(null);
  const sessionRef = useRef(null);

  useEffect(() => {
    const initWebPhone = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/sip-info');
        const { sipInfo } = await res.json();

        const webPhone = new WebPhone({
          sipInfo: [
            {
              username: sipInfo.username,
              password: sipInfo.password,
              authorizationId: sipInfo.authorizationId,
              domain: sipInfo.domain,
              outboundProxy: sipInfo.outboundProxy,
              transport: 'WSS'
            }
          ],
          appKey: 'YOUR_CLIENT_ID',
          appName: 'WebRTC Demo',
          appVersion: '1.0.0'
        });

        webPhoneRef.current = webPhone;
        webPhone.userAgent.on('registered', () => setStatus('Registered'));
      } catch (err) {
        console.error(err);
        setStatus('WebPhone init failed');
      }
    };

    initWebPhone();
  }, []);

  const makeCall = () => {
    setStatus('Calling...');
    const session = webPhoneRef.current.userAgent.invite(`sip:${toNumber}@${webPhoneRef.current.sipInfo.domain}`, {
      media: {
        constraints: { audio: true, video: false },
        render: {
          remote: document.getElementById('remoteAudio')
        }
      }
    });

    sessionRef.current = session;

    session.on('accepted', () => setStatus('Call connected'));
    session.on('terminated', () => setStatus('Call ended'));
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">RingCentral WebRTC Dialer</h1>
      <input
        type="tel"
        value={toNumber}
        onChange={(e) => setToNumber(e.target.value)}
        placeholder="Enter phone number"
        className="border p-2 w-full mb-2"
      />
      <button onClick={makeCall} className="bg-green-600 text-white px-4 py-2 rounded mr-2">
        Call
      </button>
      <p className="mt-4">Status: {status}</p>
      <audio id="remoteAudio" autoPlay />
    </div>
  );
}

export default App;

