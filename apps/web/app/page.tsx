"use client";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import css from "./page.module.css";

export default function Page() {
  const { sendMessage } = useSocket();
  const [message, setMessage] = useState("");
  
  return (
    <div>
      <div>
        <h1>All messages</h1>
      </div>
      <div>
        <input
          onChange={(e) => setMessage(e.target.value)}
          className={css["chat-input"]}
          type="text"
          placeholder="Message.."
        />
        <button onClick={(e) => sendMessage(message)} className={css["button"]}>
          Send
        </button>
      </div>
    </div>
  );
}
