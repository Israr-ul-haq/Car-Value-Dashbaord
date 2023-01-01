import React, { useEffect, useState } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import UsersService from "../../Services/UsersServices"
import Loader from "../../shared/Loader"

function AddNewSubAdmin() {
  const { userId } = useParams()
  const [user, setUser] = useState({
  })
  const [picture, setPicture] = useState(null)
  const [imgData, setImgData] = useState("/img/icon_upload_add_load.svg")
  const history = useHistory()
  const [image, setImage] = useState(false)
  const [userCount, setUserCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const [btnLock, setBtnLock] = useState(false)
  const [emptyValidation, setEmptyValidation] = useState({
    imageEmpty: false,
    fullNameEmpty: false,
    emailEmpty: "",
    phoneNumberEmpty: false,
    passwordEmpty: false,
    confirmPasswordEmpty: false,
  })
  useEffect(() => {}, [emptyValidation, user])
  const imagesPreview = (e) => {
    debugger
    if (e.target.files[0]) {
      setPicture(e.target.files[0])
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setImgData(reader.result)
        setImage(reader.result)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }
  // SERVICES
  const userService = new UsersService()

  //UseEffect
  useEffect(() => {
    if (userCount === 0) {
      getSubAdmin()
      setUserCount(1)
    }
  }, [user, userCount, imgData]) // eslint-disable-line react-hooks/exhaustive-deps

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
    let pwdPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    const c = { ...emptyValidation }
    debugger
    // if (imgData === null) {
    //   c.imageEmpty = true
    //   validCount++
    // } else {
    //   c.imageEmpty = false
    // }

    if (user.fullName === "") {
      c.fullNameEmpty = true
      validCount++
    } else {
      c.fullNameEmpty = false
    }

    if (user.email === "") {
      c.emailEmpty = "Email is Required"
      validCount++
    } else if (!pattern.test(user.email)) {
      validCount++
      c.emailEmpty = "Email should be Valid"
    } else {
      c.emailEmpty = ""
    }

    if (user.phoneNumber === "") {
      c.phoneNumberEmpty = true
      validCount++
    } else {
      c.phoneNumberEmpty = false
    }


    if (user.password === "") {
      c.passwordEmpty = "Password is required"
      validCount++
    } else if (!pwdPattern.test(user.password)) {
      validCount++
      c.passwordEmpty = "Password should contain one digit, one lower case , one upper case and atleast 8 characters"
    } else {
      c.passwordEmpty = ""
    }
    // if (user.password !== confirmPassword) {
    //   c.confirmPasswordEmpty = true
    //   validCount++
    // } else {
    //   c.confirmPasswordEmpty = false
    // }

    setEmptyValidation(c)

    if (validCount > 0) {
      return
    }
    setBtnLock(true)

    const finalUsers = {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      userStatusId: 0,
      id: userId,
      ProfilePic:"",
    }
    debugger
    finalUsers.fullName = user.fullName
    finalUsers.email = user.email
    finalUsers.phoneNumber = user.phoneNumber
    finalUsers.userStatusId = user.userStatusId
    finalUsers.password = user.password
    finalUsers.ProfilePic = imgData

    const response = await userService.editUser(finalUsers)
    
    if(response.data.code === 1){
    if(!(picture === null)){
     debugger
      const formData = new FormData()
      formData.append("profilepics", picture)
      const imageResponse = await userService.uploadImage(response.data.data.id, formData)
      localStorage.setItem("carvalueImage", imageResponse.data.data)
     
    if (imageResponse.data.code === 1) {
      history.push("/ManageSubAdmin")
      setBtnLock(false)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "SubAdmin has been Updated",
        showConfirmButton: true,
        timer: 5000,
      })
    }
    if (imageResponse.data.code === 0) {
      setBtnLock(false)

      Swal.fire({
        position: "center",
        icon: "error",
        title: response.data.data.message,
        showConfirmButton: true,
        timer: 5000,
      })
    }
    }
  else {
    history.push("/ManageSubAdmin")
    setBtnLock(false)
    Swal.fire({
      position: "center",
      icon: "success",
      title: "SubAdmin has been saved",
      showConfirmButton: true,
      timer: 5000,
    })
  }
}
}


  const getSubAdmin = async () => {
    debugger
    const response = await userService.getbyId(userId)
  
    if (response.data.code === 1) {
      setLoader(false)
      setUser(response.data.data)
    setImgData(response.data.data.profilePicName)
    }

    if (response.data.code === 0) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: response.data.data.message,
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
                <Link to="/ManageSubAdmin" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.svg" /> Edit SubAdmin
                </Link>
              </div>
            </div>
            {loader ? (
              Loader
            ) : (
              <div className="col-12 column_margin">
                <div className="card_custom">
                  <form className="myform" onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group col-md-12 form-group--uploadimage">
                        <div className="file-upload position-relative">
                          <div className="imagecontainer">
                            <label for="upload-image1" className="upload-image-label">
                              <div className="file-pic">
                                <h5 className="upload-image-title">Upload Image</h5>

                                <img src={imgData} id="image-icon" alt="upload_image" />
                              </div>
                            </label>
                            <input onChange={imagesPreview} id="upload-image" name="upload-image" hidden type="file" accept=".png, .jpg, .jpeg" />
                            {/* {emptyValidation.imageEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Image is required </p> : ""} */}
                            <div style={{position: "relative"}}>
                           <label for="upload-image"> <img  src="/img/edit_pic.svg" alt="" className="edit_img" /></label>
                              </div>
                          </div>
                          <input id="upload-image" name="upload-image" hidden type="file" accept=".png, .jpg, .jpeg" />
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
                              const x = { ...user }
                              x.fullName = e.target.value
                              setUser(x)
                            }}
                            value={user.fullName}
                          />
                          {emptyValidation.fullNameEmpty ? <p style={{ marginTop: "5px", color: "red" }}> Name is required </p> : ""}
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
                                const x = { ...user }
                                x.email = e.target.value
                                setUser(x)
                              }}
                              value={user.email}
                            />
                            {emptyValidation.emailEmpty.length !== 0 ? (
                              <p style={{ marginTop: "5px", color: "red" }}>{emptyValidation.emailEmpty} </p>
                            ) : (
                              ""
                            )}
                            <div className="tick-icon-absolute">
                              <img className="tick-email" src="./img/Correct (1).svg" id="tick-1" alt="tickicon" />
                            </div>
                          </div>
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
                            className="form_control"
                            onChange={(e) => {
                              const x = { ...user }
                              x.phoneNumber = e.target.value
                              setUser(x)
                            }}
                            value={user.phoneNumber}
                          />
                          {emptyValidation.phoneNumberEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Phone number is required</p> : ""}
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
                                const x = { ...user }
                                x.password = e.target.value
                                setUser(x)
                              }}
                              value={user.password}
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
                      {/* <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          Confirm Password
                        </label>
                        <div>
                          <input type="password" name="pwd" className="form_control" id="confirm-password" placeholder="Enter Password" />
                          <div className="tick-icon-absolute">
                            <div className="eye-icon">
                              <img alt="eye" src="/img/visibility.svg" className="eye" id="toggle-password" onClick={passwordhandlerconfirm} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    </div>
                    <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3">
                      <div className="formbtncontainer">
                        <button type="submit" disabled={btnLock} className="btn_primary submitbtn">
                          Update
                          {btnLock ? <div className="btnloader">{Loader}</div> : ""}
                        </button>
                        <Link to="/ManageSubAdmin" className="btn_primary_outline cancelbtn">
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AddNewSubAdmin
