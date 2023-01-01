import axios from "axios"
import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import AuthService from "../../../Services/AuthService"
import Loader from "../../../shared/Loader"

const Login = () => {
  //Services
  const authservice = new AuthService()

  //State
  const [login, setLogin] = useState({
    email: "",
    password: "",
  })
  const [loader, setloader] = useState(true)
  const [btnLock, setBtnLock] = useState(false)
  const history = useHistory()
  const [emptyValidation, setEmptyValidation] = useState({
    emailEmpty: "",
    passwordEmpty: false,
  })

  //UseEffect
  useEffect(() => {
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
    if (JSON.parse(localStorage.getItem("user"))) {
      history.push("/")
    } else {
      setloader(false)
    }
  }, [])
  const passwordhandler = () => {
    const password = document.querySelector("#password")
    // toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password"
    password.setAttribute("type", type)
  }

  const emailValid = () => {
    let pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    var email = document.getElementById("email-address").value
    if (!pattern.test(email)) {
      document.querySelector("#tick-1").style.display = "none"
    } else {
      document.querySelector("#tick-1").style.display = "block"
    }
  }

  //Functions
  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    let pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    let pwdPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    let validCount = 0
    const c = { ...emptyValidation }

    if (login.email === "") {
      c.emailEmpty = "Email is required"
      validCount++
    } else if (!pattern.test(login.email)) {
      validCount++
      c.emailEmpty = "Email should be valid"
    } else {
      c.emailEmpty = ""
    }

    if (login.password === "") {
      c.passwordEmpty = "Password is required"
      validCount++
    } else if (!pwdPattern.test(login.password)) {
      validCount++
      c.passwordEmpty = "Password should contain one digit, one lower case , one upper case and atleast 8 characters"
    } else {
      c.passwordEmpty = ""
    }

    setEmptyValidation(c)

    if (validCount > 0) {
      return
    }

    setBtnLock(true)

    try {
      debugger
      const response = await axios.post("http://18.192.212.127:5000/api/Accounts/login", login, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      })
      // const response = await authservice.login(login)
      if (response.status === 200) {
        setBtnLock(false)
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Logged In",
          showConfirmButton: true,
          timer: 5000,
        })
        debugger
        localStorage.setItem("carvalueId", response.data.data.user.id)
        localStorage.setItem("carvalueImage", response.data.data.user.profilePicName.replaceAll('"', ""))
        localStorage.setItem("carvalueName", response.data.data.user.fullName)
        localStorage.setItem("carvalueuser", JSON.stringify(response.data.data.user.id))
        localStorage.setItem("carvalue", JSON.stringify(response.data.data.user))
        history.push("/")
      }
    } catch (eror) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Your Email or Password is Incorrect",
        showConfirmButton: true,
        timer: 5000,
      })
      setBtnLock(false)
    }
  }

  return (
    <>
      {loader ? (
        <div className="loadercontainer">
          <div class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <section className="login">
        <div className="login-content">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
              <div className="login-header">
                <h3 className="login-header_title">Login</h3>
              </div>
              <form className="form-login" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group col-12">
                    <label htmlFor="uname" className="w-100">
                      Email
                    </label>
                    <div>
                      <input
                        onKeyUp={emailValid}
                        type="text"
                        name="uname"
                        placeholder="randy.hudson@mail.com"
                        className="form_control"
                        onChange={(e) => {
                          const c = { ...login }
                          c.email = e.target.value
                          setLogin(c)
                        }}
                        id="email-address"
                      />
                      <div className="tick-icon-absolute">
                        <img className="tick-email" src="./img/Correct (1).svg" id="tick-1" alt="tickicon" />
                      </div>
                    </div>
                    {emptyValidation.emailEmpty.length !== 0 ? <p style={{ marginTop: "5px", color: "red" }}>{emptyValidation.emailEmpty} </p> : ""}
                  </div>
                  <div className="form-group col-md-12">
                    <label htmlFor="pwd">Password</label>
                    <div>
                      <input
                        type="password"
                        name="uname"
                        className="form_control"
                        placeholder="Enter Password"
                        onChange={(e) => {
                          const c = { ...login }
                          c.password = e.target.value
                          setLogin(c)
                        }}
                        id="password"
                      />
                      <div className="tick-icon-absolute">
                        <div className="eye-icon">
                          <img alt="eye" src="/img/visibility.svg" className="eye" id="toggle-password" onClick={passwordhandler} />
                        </div>
                      </div>
                    </div>
                    {emptyValidation.passwordEmpty.length !== 0 ? (
                      <p style={{ marginTop: "5px", color: "red" }}>{emptyValidation.passwordEmpty} </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="login-button">
                  <button disabled={btnLock} type="submit" className="btn btn-primary ">
                    Login
                    {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                  </button>
                </div>
              </form>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
              <div className="logo1">
                <img alt="logo" src="/img/splash_vector.png" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login
