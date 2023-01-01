import { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"


function Header() {
  //State
  const history = useHistory()
  
  const [userData, setUserData] = useState({})
  // UseEffect
  // useEffect(() => {
  //   debugger
  //   setUserData(JSON.parse(localStorage.getItem("carvalueId")))
  //   localStorage.getItem("carvalueImage")
  //   localStorage.getItem("carvalueName")
  // }, [])

  

  const removeClass = (e) => {
    e.preventDefault()
    e.stopPropagation()
    document.querySelectorAll(".main-menu li a").forEach((item) => {
      item.closest("li").classList.remove("active")
    })
    document.querySelector(".userdropdowncontainer").closest("li").classList.remove("active")
    document.querySelector(".navbar-right .dropdown-menu-right").classList.remove("show")
    history.push(`/Profile/${localStorage.getItem("carvalueId")}`)
  }

  const logout = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
    localStorage.removeItem("carvalueuser")
    localStorage.removeItem("carvalue")
    // document.querySelector(".userdropdownmenu").remove()
    history.push("/account/login")
  }

  const toggleMenu = (e) => {
    e.stopPropagation()
    document.querySelector(".menu .main-menu").classList.toggle("mainmenu_active")
    document.querySelector(".navbar-logo").classList.toggle("logo_active")
    // document.querySelector(".userdropdownmenu").classList.toggle("userdropdownmenu_sidebaractive")
    document.querySelector("main").classList.toggle("main_sidebaractive")
  }
  

  //Functions


  return (
    <div>
      <div id="app-container" className="menu-default show-spinner">
        <nav className="navbar fixed-top">
          <div className="d-flex align-items-center navbar-left">
            <Link className="navbar-logo" to="/">
              <img className="logo d-none d-xs-block" src="./img/Logo.png" alt="logo" />
              {/* <img className="logo-mobile d-block d-xs-none" src="./img/logo.png" alt="mobile-logo" /> */}
            </Link>
            <button onClick={toggleMenu} className="menu-button d-none d-md-block">
              <img src="./img/list.svg" alt="menu-list" />
            </button>

            <button className="menu-button-mobile d-xs-block d-sm-block d-md-none">
              <img src="./img/list.svg" alt="menu-list" />
            </button>
          </div>

          <div className="navbar-right">
            <div class="user d-inline-block">
              <button
                id="dropdownMenuButton"
                class="btn btn-empty p-0"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span class="name">{localStorage.getItem("carvalueName")}</span>
                <span><img alt="Profile_Picture" src={ localStorage.getItem("carvalueImage")} className="admin-pic" /></span>
              </button>
              <div class="dropdown-menu dropdown-menu-right mt-3" aria-labelledby="dropdownMenuButton">
                <a onClick={removeClass} class="dropdown-item" href="gotoprofile">
                  Profile
                </a>
                <a onClick={logout} class="dropdown-item" href="gotologin">
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}
export default Header
