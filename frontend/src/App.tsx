import React, { useCallback, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import type { FrontendUser } from "../../backend/src/db";
import { DragonOverview } from "./pages/DragonOverview";

export { FrontendUser };

function App() {
  const [user, setUser] = useState<FrontendUser | null>(null);

  const updateUser = useCallback(async () => {
    if (!user) return;
    setUser(
      await (await fetch(`http://localhost:4000/user/${user.id}`)).json()
    );
  }, [user, setUser]);

  return (
    <div className="App">
      <header className="App-header">
        {user ? (
          <DragonOverview user={user} updateUser={updateUser} />
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
