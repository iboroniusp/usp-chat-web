import React, { useState, useEffect } from "react";
import Rooms from "./components/Rooms";
import api from "./api";

// Components

function App() {
  // Getter & Setter
  const [authenticated, setAuthenticated] = useState(false);
  const [uspNumber, setUspNumber] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(null);
  const [error, setError] = useState(null);

  console.log(process.env.REACT_APP_ENV)

  async function signin() {
    try {
      const response = await api.post("/users", {
        usp_number: uspNumber,
        password,
        name
      });

      const { data } = response;

      if (data.error) {
        setError(data.error);
      } else if (data._id) {
        setAuthenticated(data);
        sessionStorage.setItem("user_id", data._id);
        // Info guardada enquanto a sessão existir
      }
    } catch (error) {
      console.log(error);
      alert("Erro ao fazer login");
    }
  }

  if (!authenticated) {
    return (
      <section>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <hr />

        <input
          type="text"
          placeholder="Numero USP"
          value={uspNumber}
          onChange={event => setUspNumber(event.target.value)}
          // Recuperando novo valor do input através do evento
        />
        <br />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <br />

        <button onClick={signin}>Entrar</button>

        {error && <section>{error}</section>}
        {/* verifica se existe um erro e se existir mostra ele  */}
      </section>
    );
  }

  return (
    <section>
      {authenticated.name}
      <Rooms userId={authenticated._id} />
    </section>
  );
}

export default App;
