import { BroadcastChannel } from 'broadcast-channel';
import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
export default function Home() {
  const channel = new BroadcastChannel('foobar');
  const [message, setMessage] = useState('');
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 👇️ get global mouse coordinates
    const handleWindowMouseMove = (event) => {
      setGlobalCoords({
        x: event.screenX,
        y: event.screenY,
      });
    };
    window.addEventListener('mousemove', handleWindowMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
    };
  }, []);

  useEffect(() => {
    channel.postMessage({ msg: message, coords: coords });
  }, [coords]);

  const handleMouseMove = (event) => {
    setCoords({
      x: event.clientX - event.target.offsetLeft,
      y: event.clientY - event.target.offsetTop,
    });
  };

  const send = (msg) => {
    setMessage(() => msg);
    channel.postMessage({ msg: msg, coords: coords });
  };

  return (
    <div>
      <Navbar />
      <div
        onMouseMove={handleMouseMove}
        style={{ width: '100vw', height: '100vh' }}
      >
        <textarea value={message} onChange={(e) => send(e.target.value)} />
        <button onClick={send}>SEND</button>
        Coords: {coords.x} {coords.y}
      </div>
    </div>
  );
}
