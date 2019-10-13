import React, { useState, useEffect } from "react";
import Rooms from "./components/Rooms";

// Components

function App() {
  // Getter & Setter
  const [authenticated, setAuthenticated] = useState(false);
  const [uspNumber, setUspNumber] = useState("13213123");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState(null);

  async function signin() {
    try {
      const response = await fetch("http://localhost:3005/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usp_number: uspNumber,
          password
        })
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data._id) {
        setAuthenticated(data);
        sessionStorage.setItem("user_id", data._id);
        // Info guardada enquanto a sessão existir
      }
    } catch (error) {
      alert("Erro");
    }
  }

  if (!authenticated) {
    return (
      <section>
        <input
          type="text"
          placeholder="Numero USP"
          value={uspNumber}
          onChange={event => setUspNumber(event.target.value)}
          // Recuperando novo valor do input através do evento
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <button onClick={signin}>Entrar</button>

        {error && <section>{error}</section>}
        {/* verifica se existe um erro e se existir mostra ele  */}
      </section>
    );
  }

  return (
    <section style={{ height: "100%" }}>
      <Rooms userId={authenticated._id} />
    </section>
  );
}

export default App;
