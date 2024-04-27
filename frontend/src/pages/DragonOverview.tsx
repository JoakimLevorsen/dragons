import { useState } from "react";
import { FrontendUser } from "../App";

type Props = { user: FrontendUser; updateUser: () => void };

export const DragonOverview: React.FC<Props> = ({ user, updateUser }) => {
  const [newName, setNewName] = useState("");
  return (
    <div>
      <h1>User {user.id}'s Dragons </h1>
      <div>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button
          onClick={async () => {
            const response = await fetch("http://localhost:4000/dragon", {
              method: "PUT",
              body: JSON.stringify({ name: newName, userId: user.id }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (!response.ok) {
              alert(`Failed to create dragon due to ${await response.text()}`);
              return;
            }

            setNewName("");
            updateUser();
          }}
        >
          Create new Dragon
        </button>
      </div>
      <div>
        <h2>Dragons</h2>
        {user.dragons.map((dragon) => (
          <p key={dragon.id}>{dragon.name}</p>
        ))}
      </div>
    </div>
  );
};
