import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3005");

function Chat(props) {
  const { roomId, userId } = props;
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");

  useEffect(() => {
    getInitialProps();
  }, []);

  useEffect(() => {
    socket.on(roomId, message => setData([...data, message]));
  }, [data]);

  async function getInitialProps() {
    try {
      const result = await fetch(`http://localhost:3005/rooms/${roomId}`);
      const json = await result.json();
      setData(json);
      setLoading(false);
    } catch (error) {
      setError(String(error));
    }
  }

  async function sendMessage() {
    try {
      const result = await fetch(`http://localhost:3005/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          user_id: userId,
          room_id: roomId
        })
      });
      const json = await result.json();
      setText("");
      setData([...data, json]);
      setLoading(false);
    } catch (error) {
      setError(String(error));
    }
  }

  if (loading) {
    return <section>Carregando</section>;
  }

  if (error) {
    return <section>{error}</section>;
  }

  return (
    <section
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <section style={{ flex: 1, overflowY: "scroll" }}>
        <ul>
          {data.map(message => (
            <li>
              <div>{message.user_id}</div>
              <div>{message.text}</div>
            </li>
          ))}
        </ul>
      </section>

      <textarea onChange={e => setText(e.target.value)}>{text}</textarea>
      <button onClick={sendMessage}>Enviar mensagem</button>
    </section>
  );
}

export default Chat;
