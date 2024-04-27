import { FrontendUser } from "../App";

type Props = {
  user: FrontendUser;
};

export const BattlePage: React.FC<Props> = (user) => {
  return (
    <div>
      <h1>Battle page</h1>
      <p>hi there now </p>
    </div>
  );
};
