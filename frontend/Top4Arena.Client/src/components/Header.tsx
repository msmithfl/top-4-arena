import { Link } from "react-router-dom";
import AuthButton from "./AuthButton";

const Header: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-between p-4">
      {/* Logo left */}
      <Link to="/">
        <img
          src="/favicon-top4.png"
          alt="Top 4 Arena Logo"
          className="w-16 h-16"
        />
      </Link>
      <AuthButton />
    </div>
  );
};

export default Header;
