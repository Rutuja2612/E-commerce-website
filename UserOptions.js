import React, { useState } from "react";
import "./Header.css";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import DashboardIcon from "@material-ui/icons/Dashboard";
import Backdrop from "@material-ui/core/Backdrop"
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import PersonIcon from "@material-ui/icons/Person";
import { useNavigate } from "react-router-dom";
import {useAlert} from "react-alert"
import { logOut } from "../../../actions/userAction";
import {useDispatch, useSelector} from "react-redux"



const UserOptions = ({ user }) => {

  const {cartItems}=useSelector((state)=>state.cart)

  const [open, setOpen] = useState(false);
  const history = useNavigate();
   const alert=useAlert();
   const dispatch=useDispatch();



  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    {icon: <ShoppingCartIcon style={{color:cartItems.length>0?"tomato":"unset"}}/>, name: `Cart(${cartItems.length})`, func:cart },
    { icon: <ExitToAppIcon />, name: "Logout", func: logutUser },
  ];

  if (user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  function dashboard() {
    history("/admin/dashboard");
  }

  function orders() {
    history("/orders");
  }

  function account() {
    history("/account");
  }

  function cart() {
    history("/cart");
  }

  function logutUser() {
    dispatch(logOut());
    alert.success("Logout Successfully");
  }

  return (
    <>
    <Backdrop open={open} style={{zIndex:"10"}}/>
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        style={{zIndex:"11"}}
        direction="down"
        className="speedDial"
        icon={
          <img
            className="speedDialIcon"
            src={user.avatar.url ? user.avatar.url : "/Profile.png"}
            alt="Profile"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction key={item.name}
          icon={item.icon} tooltipTitle={item.name} onClick={item.func}
            tooltipOpen={window.innerWidth<=600 ?true :false}
          />
        ))}
      </SpeedDial>
    </>
  );
};

export default UserOptions;
