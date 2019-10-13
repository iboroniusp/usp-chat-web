import React, { useEffect, useState } from "react";
import Chat from "../Chat";

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
      const result = await fetch("http://localhost:3005/rooms");
      const json = await result.json();
      setData(json);
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
            <button onClick={() => setRoom(room)}>{room.name}</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Rooms;
