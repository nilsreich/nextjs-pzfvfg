import { BroadcastChannel } from 'broadcast-channel';
import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
export default function Screen() {
  const channel = new BroadcastChannel('foobar');
  const [message, setMessage] = useState('');
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  useEffect(() => {
    channel.onmessage = (msg) => {
      setMessage(() => msg.msg);
      setPointer(() => msg.coords);
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div>{message}</div>
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          left: pointer.x,
          top: pointer.y,
        }}
      >
        x
      </div>
    </div>
  );
}
