import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import api from "../../api";

const socket = io(
  process.env.REACT_APP_ENV === "development"
    ? "http://localhost:3005"
    : "https://usp-chat-api.herokuapp.com/"
);

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
      const response = await api.get(`/rooms/${roomId}`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(String(error));
    }
  }

  async function sendMessage() {
    try {
      const response = await api.post(`/messages`, {
        text,
        user_id: userId,
        room_id: roomId,
        
        
      });
      setText("");
      setData([...data, response.data]);
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
    <section>
      <section>
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
