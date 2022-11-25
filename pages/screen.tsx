import { useState, useEffect } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
export default function Screen() {
  const [message, setMessage] = useState("");
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  let bc = null;
  if (typeof window != "undefined") {
    bc = new BroadcastChannel("thechannel");
  }
  useEffect(() => {
    bc.onmessage = (msg: any) => {
      let data = JSON.parse(msg.data);
      setMessage(() => data.msg);
      setPointer(() => data.coords);
    };
  }, []);

  return (
    <div>
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
      <div
        className="h-4 w-4  bg-opacity-90 blur-sm rounded-full bg-red-500 absolute"
        style={{
          left: pointer.x - 24,
          top: pointer.y - 24,
        }}
      ></div>
    </div>
  );
}
