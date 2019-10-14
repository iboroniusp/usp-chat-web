import React, { useEffect, useState } from "react";
import Chat from "../Chat";
import api from "../../api";

function Rooms({ userId }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    getInitialProps();
  }, []);

  async function getInitialProps() {
    try {
      const response = await api.get("/rooms");
      setData(response.data);
      setLoading(false);
    } catch (error) {}
  }

  if (loading) {
    return <section>Carregando</section>;
  }

  if (room) {
    return <Chat roomId={room._id} userId={userId} />;
  }

  return (
    <section>
      <ul>
        {data.map(room => (
          <li>
            <button className="customRoomButton" onClick={() => setRoom(room)}>{room.name}</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Rooms;
