import React, { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import "react-datepicker/dist/react-datepicker.css"
import UsersService from "../../Services/UsersServices"
import Loader from "../../shared/Loader"

function AddNewUser() {
  // SERVICES
  const usersService = new UsersService()

  //State
  const history = useHistory()
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    profilePicName: "",
    password: "",
    userStatusId: 1,
    roles: ["Admin"],
    isActive: true,
  })
  const [picture, setPicture] = useState(null)
  const [imgData, setImgData] = useState(null)
  const [btnLock, setBtnLock] = useState(false)
  const [emptyValidation, setEmptyValidation] = useState({
    imageEmpty: false,
    nameEmpty: false,
    emailEmpty: "",
    passwordEmpty: false,
    confirmPasswordEmpty: false,
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  //UseEffect
  useEffect(() => {}, [emptyValidation, user])

  //Functions
  const imagesPreview = (e) => {
    debugger
    if (e.target.files[0]) {
      setPicture(e.target.files[0])
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setImgData(reader.result)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const deleteItem = () => {
    setPicture(null)
    setImgData(null)
  }

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength)
    }
  }

  const passwordhandler = () => {
    const password = document.querySelector("#password")
    // toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password"
    password.setAttribute("type", type)
  }

  const passwordhandlerconfirm = () => {
    const password = document.querySelector("#confirm-password")
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    let validCount = 0
    let pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/

    const c = { ...emptyValidation }
    if (imgData === null) {
      c.imageEmpty = true
      validCount++
    } else {
      c.imageEmpty = false
    }

    if (user.fullName === "") {
      c.nameEmpty = true
      validCount++
    } else {
      c.nameEmpty = false
    }

    if (user.email === "") {
      c.emailEmpty = "Email is required"
      validCount++
    } else if (!pattern.test(user.email)) {
      validCount++
      c.emailEmpty = "Email should be valid"
    } else {
      c.emailEmpty = ""
    }

    if (user.phoneNumber === "") {
      c.phoneEmpty = true
      validCount++
    } else {
      c.phoneEmpty = false
    }

    if (user.Password === "") {
      c.passwordEmpty = true
      validCount++
    } else {
      c.passwordEmpty = false
    }

    if (user.password !== confirmPassword) {
      c.confirmPasswordEmpty = true
      validCount++
    } else {
      c.confirmPasswordEmpty = false
    }

    setEmptyValidation(c)

    if (validCount > 0) {
      return
    }
    setBtnLock(true)

    const response = await usersService.save(user)
    debugger
    if (response.data.Code === 1) {
      history.push("/ManageUsers")
      setBtnLock(false)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "User has been saved",
        showConfirmButton: true,
        timer: 5000,
      })
    }

    //   const imageResponse = await usersService.uploadImage(formData)

    //   if (imageResponse.data.Code === 0) {
    //     setBtnLock(false)
    //     Swal.fire({
    //       position: "center",
    //       icon: "error",
    //       title: imageResponse.data.Data.Message,
    //       showConfirmButton: true,
    //       timer: 5000,
    //     })
    //   }
    // }

    if (response.data.Code === 0) {
      setBtnLock(false)

      Swal.fire({
        position: "center",
        icon: "error",
        title: response.data.Message,
        showConfirmButton: true,
        timer: 5000,
      })
    }
  }

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <Link to="/ManageUsers" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.svg" /> Add New User
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                <form className="myform" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group col-md-12 form-group--uploadimage">
                      <div className="file-upload position-relative">
                        <div className="imagecontainer">
                          <label for="upload-image" className="upload-image-label">
                            <div className="file-pic">
                              <h5 className="upload-image-title">Upload Image</h5>

                              <img src="/img/icon_upload_add_load.svg" id="image-icon" alt="upload_image" />
                            </div>
                            <img id="cross-icon" alt="delete_image" src="/img/cancel.svg" />{" "}
                          </label>
                          {imgData ? (
                            <div className="uploadedimages">
                              <img className="uploadedimage" src={imgData} alt="uploaded_image" />
                              <img onClick={deleteItem} className="delete_upload_image" alt="delete_uploaded_image" src="/img/cancel.svg" />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <input onChange={imagesPreview} id="upload-image" name="upload-image" hidden type="file" accept=".png, .jpg, .jpeg" />
                        {emptyValidation.imageEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Image is required </p> : ""}
                      </div>
                    </div>

                    <div className="form-group col-md-4">
                      <div className="name">
                        <label htmlfor="username">Full Name</label>
                        <input
                          type="text"
                          name="username"
                          className="form_control"
                          placeholder="Enter Name"
                          onChange={(e) => {
                            const c = { ...user }
                            c.fullName = e.target.value
                            setUser(c)
                          }}
                          value={user.fullName}
                        />
                        {emptyValidation.nameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Name is required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="email-container position-relative">
                        <label htmlfor="uname" className="w-100 email-label">
                          Email
                        </label>
                        <div>
                          <input
                            onKeyUp={emailValid}
                            type="text"
                            name="uname"
                            placeholder="Enter Email Address"
                            className="form_control"
                            id="email-address"
                            onChange={(e) => {
                              const c = { ...user }
                              c.email = e.target.value
                              setUser(c)
                            }}
                            value={user.email}
                          />
                          <div className="tick-icon-absolute">
                            <img className="tick-email" src="./img/Correct (1).svg" id="tick-1" alt="tickicon" />
                          </div>
                        </div>
                        {emptyValidation.emailEmpty.length !== 0 ? (
                          <p style={{ marginTop: "5px", color: "red" }}>{emptyValidation.emailEmpty} </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="phone-container position-relative">
                        <label htmlfor="tel" className="number-label">
                          Phone Number
                        </label>
                        <input
                          type="number"
                          maxLength="11"
                          onInput={maxLengthCheck}
                          placeholder="Enter PhoneNumber"
                          selected={user.phoneNumber}
                          className="form_control"
                          onChange={(e) => {
                            const c = { ...user }
                            c.phoneNumber = e.target.value
                            setUser(c)
                          }}
                        />
                        {emptyValidation.phoneEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Phone number is required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          Password
                        </label>
                        <div>
                          <input
                            type="password"
                            name="pwd"
                            className="form_control"
                            id="password"
                            placeholder="Enter Password"
                            onChange={(e) => {
                              const c = { ...user }
                              c.password = e.target.value
                              setUser(c)
                            }}
                            value={user.password}
                          />
                          <div className="tick-icon-absolute">
                            <div className="eye-icon">
                              <img alt="eye" src="/img/visibility.svg" className="eye" id="toggle-password" onClick={passwordhandler} />
                            </div>
                          </div>
                        </div>
                        {emptyValidation.passwordEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Password is required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          Confirm Password
                        </label>
                        <div>
                          <input
                            type="password"
                            name="pwd"
                            className="form_control"
                            id="confirm-password"
                            placeholder="Enter Password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                          />
                          <div className="tick-icon-absolute">
                            <div className="eye-icon">
                              <img alt="eye" src="/img/visibility.svg" className="eye" id="toggle-password" onClick={passwordhandlerconfirm} />
                            </div>
                          </div>
                        </div>
                        {emptyValidation.confirmPasswordEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Password not matching </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3">
                      <div className="formbtncontainer">
                        <button type="submit" disabled={btnLock} className="btn_primary submitbtn">
                          Save
                          {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                        </button>
                        <Link to="/ManageUsers" className="btn_primary_outline cancelbtn">
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AddNewUser
