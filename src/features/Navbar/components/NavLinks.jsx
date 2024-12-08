import { AiFillHome, AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { MdAppRegistration } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/auth.context";
import CustomNavLink from "./CustomNavLink";

const NavLinks = ({ handleSidebarToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <>
      <CustomNavLink
        to="/"
        icon={<AiFillHome />}
        text="হোম পেইজ"
        handleSidebarToggle={handleSidebarToggle}
      />
      {!user && (
        <CustomNavLink
          icon={<AiOutlineLogin />}
          to="/login"
          text="লগইন করুন"
          handleSidebarToggle={handleSidebarToggle}
        />
      )}
      {!user && (
        <CustomNavLink
          to="/signup"
          icon={<MdAppRegistration />}
          text="আয় করুন"
          highlight
          handleSidebarToggle={handleSidebarToggle}
        />
      )}
      {user && (
        <CustomNavLink
          to={`/profile/${user?.id}`}
          icon={<CgProfile />}
          text="প্রোফাইল"
          handleSidebarToggle={handleSidebarToggle}
        />
      )}
      {user && (
        <button
          onClick={() => {
            logout();
            navigate("/login");
            handleSidebarToggle();
          }}
          className="lg:blok flex items-center gap-5 px-8 py-4 text-sm hover:cursor-pointer active:bg-primary lg:rounded-lg lg:px-4 lg:py-4 lg:hover:bg-neutral"
        >
          <span className="text-2xl lg:hidden">
            <AiOutlineLogout />
          </span>
          <span>লগআউট করুন</span>
        </button>
      )}
    </>
  );
};

export default NavLinks;
