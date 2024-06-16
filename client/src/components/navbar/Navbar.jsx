// // import Image from "next/image";
// // import Logo from "../public/image/logo.png";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiShoppingCartThin } from "react-icons/pi";
import AuthContext from "../../context/AuthContext.js";
import { useContext } from "react";
import { CiUser } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../../assets/image/logo.png";
import CartContext from "../../context/cartContext.js";
import { useCookies } from "react-cookie";

import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Card,
  IconButton,
} from "@material-tailwind/react";
import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  RocketLaunchIcon,
  Bars2Icon,
} from "@heroicons/react/24/outline";

const Nav = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const { cart, cartDispatch } = useContext(CartContext);
  const navbarOptions = [
    { id: "1", title: "Shop", url: "/" },
    { id: "2", title: "New Arrival", url: "/" },
    { id: "3", title: "Contact Us", url: "/contact" },
    { id: "4", title: "FAQs", url: "/faq" },
  ];
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem(user);
    localStorage.removeItem(cart);
    cartDispatch({ type: "CLEAR_CART" });
    removeCookie("access_token");
    toast.success("Logged out successfully!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    navigate("/");
  };

  return (
    <div className=" mx-auto w-full h-24 flex flex-row items-center justify-evenly gap-4 px-6 ">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className=" w-full justify-center flex flex-row items-center md:justify-start md:max-w-1/3 md:w-1/3">
        <Link to="/">
          <img src={Logo} alt="alora" className="object-contain w-48 h-auto" />
        </Link>
      </div>
      <div className=" hidden  max-w-1/3 w-1/3 md:flex flex-row items-center justify-evenly gap-4 text-accent font-medium font-inter  ">
        {navbarOptions.map((item) => {
          return (
            <Link
              key={item.id}
              href={item.url}
              className="hover:text-accentDark"
            >
              {item.title}
            </Link>
          );
        })}
      </div>
      <div className="hidden center max-w-1/3 w-1/3 md:flex flex-row items-center justify-center gap-4 text-accent font-normal font-inter md:justify-end">
        <div className="max-w-[250px] px-4 min-w-[100px]">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 cursor-pointer left-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="w-full py-3 pl-12 pr-4 text-accent border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-accentDark"
            />
          </div>
        </div>
        <span className="flex flex-row items-center justify-between gap-6">
          {user && (
            <Link to={`cart/${user._id}`} className="relative">
              {cart && cart.items.length >= 1 && (
                <span className="absolute text-white font-medium text-xs -top-2 -right-2 rounded-full p-1 bg-red-700 h-4  w-4 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
              <PiShoppingCartThin className="w-7 h-7 cursor-pointer" />
            </Link>
          )}
          {!user && (
            <Link
              onClick={() => {
                alert("Login to continue to cart");
              }}
              // className="relative"
            >
              <PiShoppingCartThin className="w-8 h-8 cursor-pointer" />
            </Link>
          )}
          {user ? (
            <div className="relative dropdown">
              <button className="block h-8 w-8 rounded-full overflow-hidden focus:outline-none ">
                <img
                  src={user.image}
                  className="rounded-full h-full w-full object-cover dropbtn"
                  alt=""
                />
              </button>
              <div className=" absolute right-0 w-40 mt-0 ml-1 py-2 bg-white border rounded shadow-xl z-50 dropdown-content">
                <a
                  className="transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-accent hover:text-white"
                  href="/myprofile"
                >
                  Profile
                </a>
                <div className="py-2">
                  <hr />
                </div>
                <a
                  className="transition-colors duration-200 block px-4 py-2 text-normal text-gray-900 rounded hover:bg-accent hover:text-white"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <CiUser className="w-7 h-7  cursor-pointer" />
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Nav;

// profile menu component
const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    label: "Edit Profile",
    icon: Cog6ToothIcon,
  },
  {
    label: "Inbox",
    icon: InboxArrowDownIcon,
  },
  {
    label: "Help",
    icon: LifebuoyIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-blue-500 p-0.5"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={label}
              onClick={closeMenu}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

// nav list menu
const navListMenuItems = [
  {
    title: "@material-tailwind/html",
    description:
      "Learn how to use @material-tailwind/html, packed with rich components and widgets.",
  },
  {
    title: "@material-tailwind/react",
    description:
      "Learn how to use @material-tailwind/react, packed with rich components for React.",
  },
  {
    title: "Material Tailwind PRO",
    description:
      "A complete set of UI Elements for building faster websites in less time.",
  },
];

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const triggers = {
    onMouseEnter: () => setIsMenuOpen(true),
    onMouseLeave: () => setIsMenuOpen(false),
  };

  const renderItems = navListMenuItems.map(({ title, description }) => (
    <a href="#" key={title}>
      <MenuItem>
        <Typography variant="h6" color="blue-gray" className="mb-1">
          {title}
        </Typography>
        <Typography variant="small" color="gray" className="font-normal">
          {description}
        </Typography>
      </MenuItem>
    </a>
  ));

  return (
    <React.Fragment>
      <Menu open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography as="a" href="#" variant="small" className="font-normal">
            <MenuItem
              {...triggers}
              className="hidden items-center gap-2 text-blue-gray-900 lg:flex lg:rounded-full"
            >
              <Square3Stack3DIcon className="h-[18px] w-[18px]" /> Pages{" "}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler>
        <MenuList
          {...triggers}
          className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid"
        >
          <Card
            color="blue"
            shadow={false}
            variant="gradient"
            className="col-span-3 grid h-full w-full place-items-center rounded-md"
          >
            <RocketLaunchIcon strokeWidth={1} className="h-28 w-28" />
          </Card>
          <ul className="col-span-4 flex w-full flex-col gap-1">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <MenuItem className="flex items-center gap-2 text-blue-gray-900 lg:hidden">
        <Square3Stack3DIcon className="h-[18px] w-[18px]" /> Pages{" "}
      </MenuItem>
      <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
        {renderItems}
      </ul>
    </React.Fragment>
  );
}

// nav list component
const navListItems = [
  {
    label: "Account",
    icon: UserCircleIcon,
  },
  {
    label: "Blocks",
    icon: CubeTransparentIcon,
  },
  {
    label: "Docs",
    icon: CodeBracketSquareIcon,
  },
];

function NavList() {
  return (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      <NavListMenu />
      {navListItems.map(({ label, icon }, key) => (
        <Typography
          key={label}
          as="a"
          href="#"
          variant="small"
          color="blue-gray"
          className="font-normal"
        >
          <MenuItem className="flex items-center gap-2 lg:rounded-full">
            {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
            {label}
          </MenuItem>
        </Typography>
      ))}
    </ul>
  );
}

// export default function ComplexNavbar() {
//   const [isNavOpen, setIsNavOpen] = React.useState(false);
//   const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

//   React.useEffect(() => {
//     window.addEventListener(
//       "resize",
//       () => window.innerWidth >= 960 && setIsNavOpen(false)
//     );
//   }, []);

//   return (
//     <Navbar className="mx-auto max-w-screen-xl p-2 lg:rounded-full lg:pl-6">
//       <div className="relative mx-auto flex items-center text-blue-gray-900">
//         <Typography
//           as="a"
//           href="#"
//           className="mr-4 ml-2 cursor-pointer py-1.5 font-medium"
//         >
//           Material Tailwind
//         </Typography>
//         <div className="absolute top-2/4 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block">
//           <NavList />
//         </div>
//         <IconButton
//           size="sm"
//           color="blue-gray"
//           variant="text"
//           onClick={toggleIsNavOpen}
//           className="ml-auto mr-2 lg:hidden"
//         >
//           <Bars2Icon className="h-6 w-6" />
//         </IconButton>
//         <ProfileMenu />
//       </div>
//       <MobileNav open={isNavOpen} className="overflow-scroll">
//         <NavList />
//       </MobileNav>
//     </Navbar>
//   );
// }
