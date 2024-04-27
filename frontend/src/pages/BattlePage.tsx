import { User } from "../App";

type Props = {
  user: User;
};

export const BattlePage: React.FC<Props> = (user) => {
  return (
    <div>
      <h1>Battle page</h1>
    </div>
  );
};
