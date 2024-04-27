import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import type { User } from "../../backend/src/db";
import { BattlePage } from "./pages/BattlePage";

export { User };

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <div className="App">
      <header className="App-header">
        {user ? (
          <BattlePage user={user} />
        ) : (
          <button
            onClick={async () => {
              const response = await fetch("http://localhost:4000/user", {
                method: "PUT",
              });
              // Should maybe also be zod parsed
              const body = await response.json();
              setUser(body);
            }}
          >
            Create user
          </button>
        )}
      </header>
    </div>
  );
}

export default App;
