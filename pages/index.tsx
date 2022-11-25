import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

export default function Home() {
  const [message, setMessage] = useState("a");
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });
  let bc = null;
  if (typeof window != "undefined") {
    bc = new BroadcastChannel("thechannel");
  }

  useEffect(() => {
    // 👇️ get global mouse coordinates
    const handleWindowMouseMove = (event) => {
      setGlobalCoords({
        x: event.screenX,
        y: event.screenY,
      });
    };
    window.addEventListener("mousemove", handleWindowMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, []);

  useEffect(() => {
    bc.postMessage(JSON.stringify({ msg: message, coords: coords }));
  }, [coords]);

  const handleMouseMove = (event) => {
    console.log(event.target.offsetTop);
    setCoords({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const send = (msg) => {
    setMessage(() => msg);
    const temp = JSON.stringify({ msg: msg, coords: coords });
    bc.postMessage(temp);
  };

  return (
    <div className="h-screen bg-slate-100">
      <Navbar />
      <div className="flex h-full w-full">
        <div className="w-1/2  cursor-none	" onMouseMove={handleMouseMove}>
          <div
            className="h-4 w-4  bg-opacity-90 blur-sm rounded-full bg-red-500 absolute"
            style={{
              left: coords.x,
              top: coords.y,
            }}
          ></div>
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: String(
                unified()
                  .use(remarkParse)
                  .use(remarkMath)
                  .use(remarkRehype)
                  .use(rehypeKatex)
                  .use(rehypeStringify)
                  .processSync(message)
              ),
            }}
          ></div>
        </div>
        <textarea
          className="grow h-full"
          value={message}
          onChange={(e) => send(e.target.value)}
        />
      </div>
    </div>
  );
}
