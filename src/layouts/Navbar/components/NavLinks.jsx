import { AiFillHome, AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { MdAppRegistration } from "react-icons/md";
import { useAuth } from "../../../features/Authentication/contexts/AuthContext";
import { CustomNavLink } from "./CustomNavLink";

const NavLinks = () => {
  const { currentUser, logout } = useAuth();
  return (
    <>
      <CustomNavLink to="/" icon={<AiFillHome />} text="হোম পেইজ" />
      {/* <CustomNavLink
        to="/services"
        icon={<MdOutlineTaskAlt />}
        text="সার্ভিস সমূহ"
      /> */}
      {currentUser ? null : (
        <CustomNavLink icon={<AiOutlineLogin />} to="/login" text="লগইন করুন" />
      )}
      {currentUser ? null : (
        <CustomNavLink
          to="/signup"
          icon={<MdAppRegistration />}
          text="আয় করুন"
          highlight
        />
      )}
      {currentUser && (
        <CustomNavLink
          to={`/profile/${currentUser?._id}`}
          icon={<CgProfile />}
          text="প্রোফাইল"
        />
      )}
      {currentUser && (
        <button
          onClick={logout}
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

export { NavLinks };
