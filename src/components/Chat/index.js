import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import api from "../../api";
import moment from "moment";

const socket = io(
  process.env.REACT_APP_ENV === "development"
    ? "http://localhost:3005"
    : "https://usp-chat-api.herokuapp.com/"
);

function Chat(props) {
  const { roomId, userId, userName, roomName, onCloseRoom } = props;
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getInitialProps();
  }, []);

  useEffect(() => {
    socket.on(
      roomId,
      message => message.user_id._id !== userId && setData([...data, message])
    );
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
    const oldText = text;
    setSending(true);
    setText("");
    try {
      if (text != "") {
        const response = await api.post(`/messages`, {
          text,
          user_id: userId,
          room_id: roomId
        });
        setData([...data, response.data]);
        setSending(false);
      }
    } catch (error) {
      setError(String(error));
      setText(oldText);
    }
  }

  if (loading) {
    return <section>Carregando</section>;
  }

  if (error) {
    return <section>{error}</section>;
  }

  return (
    <section className="chat-container">
      <section className="chat-header">
        <section className="room-name">Sala: {roomName}</section>
        <button onClick={onCloseRoom}>Fechar Sala</button>
      </section>

      <section className="chat-messages-container">
        <ul className="chat-messages-list">
          {data.map(message => (
            <li key={message._id}>
              <div>
                <font size="3">
                  <b>{message.user_id.name}</b>
                </font>
                : {message.text}
              </div>
              <div>
                <font size="1">{moment(message.createdAt).format("LLL")}</font>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <div className="chatDiv">
        <textarea
          id="msg"
          className="textArea"
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          value={text}
          disabled={sending}
        />
        <button disabled={sending} className="textButton" onClick={sendMessage}>
          {sending ? "Enviando Mensagem..." : "Enviar Mensagem"}
        </button>
      </div>
    </section>
  );
}
export default Chat;
