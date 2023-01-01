import React, { useState, useEffect } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import UsersService from "../../Services/UsersServices"
import Loader from "../../shared/Loader"
import Swal from "sweetalert2"

function Profile() {

  const userService = new UsersService()
  const { id } = useParams()
  const history = useHistory()
  const [user, setUser] = useState({})
  const [loader, setLoader] = useState(true)
  const [btnLock, setBtnLock] = useState(false)
  const [userCount, setUserCount] = useState(0)

  //Fucntions
  // const logout = (evt) => {
  //   evt.preventDefault()
  //   evt.stopPropagation()
  //   localStorage.removeItem("makhtabquser")
  //   document.querySelector(".userdropdownmenu").remove()
  //   history.push("/account/login")
  // }

  useEffect(() => {
    if (userCount === 0) {
      getUser()
      setUserCount(1)
    }
  }, [user, userCount]) // eslint-disable-line react-hooks/exhaustive-deps

  const getUser = async () => {
    debugger
    try {
      setBtnLock(true)
      const response = await userService.get(localStorage.getItem("carvalueId"))

      // const finalAdmins = []
      // response.data.data.forEach((element) => {
      //   if (element.id === id) {
      //     finalAdmins.push(element)
      //   }
      // })
      if (response.data.code === 1) {
        setBtnLock(false)

        setUser(response.data.data)
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
  return (
    <main>
      <div class="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="headertopbar">
              <Link to="/" className="headertopbar_title">
                {" "}
                <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.svg" /> Profile
              </Link>
              <div className="superadmin-buttons">
                {/* <Link class="superadmin-logout btn btn_primary" to="/account/login" >
                  Log Out
                </Link> */}
              </div>
            </div>
          </div>
          <div className="col-12 column_margin-profile">
            <div className="card_custom">
              {loader ? (
                Loader
              ) : (
                <div className="row align-items-center">
                  <div className="col-md-3">
                    <img alt="Profile_Picture" src={
                      user[0]?.profilePic
                    } style={{ width: "65%", height: "150px", borderRadius: "15px" }} />
                  </div>
                  <div className="col-md-9">
                    <div className="row">
                      <div className="col-md-4">
                        <h3 className="view-profile-name">Full Name</h3>
                        <h4 className="view-profile-user-name">{user[0]?.fullName}</h4>
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
          </div>
        </div>
      </div>
    </main>
  )
}

export default Profile
