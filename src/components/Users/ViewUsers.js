import React, { useEffect, useState } from "react"
import { useParams, Link, useHistory } from "react-router-dom"
import UsersService from "../../Services/UsersServices"
import Loader from "../../shared/Loader"
import Swal from "sweetalert2"
import { statusId } from "../Common/statusId"
import axios from "axios"
function ViewUsers() {
  // SERVICES
  const userService = new UsersService()

  //State
  const [user, setUser] = useState({})
  const [userCount, setUserCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const { id } = useParams()
  const [btnLock, setBtnLock] = useState(false)
  const [userStatus, setUserStatus] = useState({
    id: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    userStatusId: 0,
    profilePicName: user[0]?.profilePic,
  })
  const history = useHistory()
  //UseEffect
  useEffect(() => {
    if (userCount === 0) {
      getUser()
      setUserCount(1)
    }
  }, [user, userCount]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions

  const getUser = async () => {
    try {
      debugger
     
      const response = await userService.get(id)

      const finalAdmins = []
      response.data.data.forEach((element) => {
        if (element.id === id) {
          finalAdmins.push(element)
        }
      })
      if (response.data.code === 1) {
        setBtnLock(false)

        setUser(finalAdmins)
        setLoader(false)
        
      }
    } catch (error) {
      setBtnLock(false)
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.data.data.Message,
        showConfirmButton: true,
        timer: 5000,
      })
    }
  }

  const block = async () => {
    setBtnLock(true)
    userStatus.id = user[0].id
    userStatus.fullName = user[0].fullName
    userStatus.email = user[0].email
    userStatus.phoneNumber = user[0].phoneNumber
    userStatus.profilePicName = user[0].profilePic
    userStatus.isActive = true
    userStatus.userStatusId = statusId.Blocked
    try {
      setBtnLock(true)
      debugger
      const response = await userService.update(userStatus)
      if (response.status === 200) {
        setBtnLock(false)
        history.push("/ManageUsers")
        Swal.fire({
          position: "center",
          icon: "success",
          title: "User has been blocked",
          showConfirmButton: true,
          timer: 5000,
        })
      }
    } catch (error) {
      setBtnLock(false)
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.data.Message,
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
                <Link className="arrow-container_link" to="/ManageUsers">
                  <img className="arrow-container_image" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.svg" />
                  <h1 className="headertopbar_title">View User-Profile</h1>
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                {loader ? (
                  Loader
                ) : (
                  <div className="row">
                    <div className="col-md-3">
                      <img style={{ width: "73%", height: "166px", borderRadius: "15px" }} alt="event_image" src={user[0]?.profilePic} />
                    </div>
                    <div className="col-md-9">
                      <div className="row">
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Full Name</h3>
                          <h4 className="view-profile-user-name">{user[0]?.fullName}</h4>
                          {/* <div className="view-profile-pwd">
                            <h3 className="view-profile-name">Password</h3>
                            <h4 className="view-profile-user-name">********</h4>
                          </div> */}
                        </div>
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Phone Number</h3>
                          <h4 className="view-profile-user-name">{user[0]?.phoneNumber}</h4>
                        </div>
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Email</h3>
                          <h4 className="view-profile-user-name">{user[0]?.email}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-md-12">
                <div className="profile-business-buttons">
                  <button disabled={btnLock} onClick={block} className="profile-business-accept btn btn-primary">
                    Block {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                  </button>
                  <Link to="/ManageUsers">
                    <button className="profile-business-reject btn btn-primary">Cancel</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
export default ViewUsers
