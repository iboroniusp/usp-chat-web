import React, { useState, useEffect } from "react";
import Rooms from "./components/Rooms";
import api from "./api";
import "./index.css";
import logo from "./utils/usp-chat-logo.png";
import profile from "./utils/profile.png";

// Components

function App() {
  // Getter & Setter
  const [authenticated, setAuthenticated] = useState(false);
  const [uspNumber, setUspNumber] = useState("13213123");
  const [password, setPassword] = useState("1234");
  const [name, setName] = useState(null);
  const [error, setError] = useState(null);

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
    <div className="main">
    <div className="image"><img src={logo}/></div>
    <div className="box">
      <section>
        <input
          className="customInput"
          type="text"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          />

        <hr />

        <input
          className="customInput"
          type="text"
          placeholder="Número USP"
          value={uspNumber}
          onChange={event => setUspNumber(event.target.value)}
          // Recuperando novo valor do input através do evento
        />
        <br />
        <input
          className="customInput"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <br />

        <div className="buttonDiv"><button className="customButton" onClick={signin}>Entrar</button></div>

        {error && <section>{error}</section>}
        {/* verifica se existe um erro e se existir mostra ele  */}
      </section>
    </div>
    </div>  
    );
  }

  return (
    <div className="mainRoom">
      <div className="profile">
         <img className="profileImg" src={profile} height="30px" width="30px"/>
        <section className="userName">
        {authenticated.name}
        </section>
      </div> 
      <section>
        <Rooms userId={authenticated._id} />
      </section>
    </div>
  );
}

export default App;
