import { NavLink, useHistory } from "react-router-dom"
import React, { useEffect } from "react"
import PerfectScrollbar from "perfect-scrollbar"
function Sidebar() {
  //State

  // Functions

  // const handleScroll = (e) => {
  //   document.querySelector(".userdropdownmenu").style.cssText = "position: fixed; left:95px;"
  //   document.querySelector(".userdropdownmenu").style.top = document.querySelector(".userdropdownli").getBoundingClientRect().top + "px"
  // }

  const addClass = (e) => {
    e.stopPropagation()
    document.querySelectorAll(".main-menu li a").forEach((item) => {
      item.closest("li").classList.remove("active")
    })
    document.querySelector(".userdropdowncontainer").closest("li").classList.remove("active")
    e.target.closest("li").className = "active"
  }

  //UseEffect

  useEffect(() => {
    document.querySelectorAll(".main-menu li a").forEach((item) => {
      if (item.classList.contains("active")) {
        item.closest("li").classList.add("active")
      }
    })
    document.querySelectorAll(".userdropdownitem").forEach((item) => {
      if (item.classList.contains("active")) {
        document.querySelector(".userdropdowncontainer").closest("li").classList.add("active")
      }
    })
  }, [])

  useEffect(() => {
    //To initialise:

    const container = document.querySelector("#menuScroll")
    const ps = new PerfectScrollbar(container)
  })

  return (
    <div>
      <div className="menu">
        <div className="main-menu">
          <div id="menuScroll" className="scroll" >
            <ul className="list-unstyled">
              <li onClick={addClass}>
                <NavLink exact to="/">
                  <img src="img/Icon material-dashboard.svg" alt="sidebar-icon" />
                  <span>Dashboards</span>
                </NavLink>
              </li>

              <li onClick={addClass}>
                <div className="userdropdowncontainer">
                  <NavLink to="/ManageUsersRequest">
                    <img src="img/user (1) (1).svg" alt="sidebar-icon" />
                    <span>Users Requests</span>
                  </NavLink>
                </div>
              </li>
              <li onClick={addClass}>
                <NavLink to="/ManageUsers">
                  <img src="img/user (1) (2).svg" alt="sidebar-icon" />
                  <span>Manage Users</span>
                </NavLink>
              </li>
              <li onClick={addClass}>
                <NavLink to="/ManageSubAdmin">
                  <img src="img/user (1) (2).svg" alt="sidebar-icon" />
                  <span>Manage Sub Admin</span>
                </NavLink>
              </li>
              <li onClick={addClass}>
                <NavLink to="/ManageAuctions">
                  <img src="img/Auction Icon.svg" alt="sidebar-icon" />
                  <span>Auction</span>
                </NavLink>
              </li>

              <li onClick={addClass}>
                <NavLink to="/ManagePayments">
                  <img src="img/Payment Icon.svg" alt="sidebar-icon" />
                  <span>Payment</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
