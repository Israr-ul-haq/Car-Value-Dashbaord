import axios from "../shared/AxiosConfig"

export default class UsersService {
  get = async () => {
    try {
      const response = await axios.get("/api/Accounts/PopulateUserDetails")
      return response
    } catch (error) {
      return error.response
    }
  }
  getbyId = async (userId) =>{
    try {
      const response = await axios.get(`/api/Accounts/PopulateUserDetailsByUserId?id=${userId}`)
      return response
    } catch (error) {
      return error.response
    }
  }
  editUser = async (obj) => {
    try {
      const response = await axios.put("/api/Accounts/UpdateUserDetails",obj)
      return response
    } catch (error) {
      return error.response
    }
  }


  save = async (data) => {
    try {
      const response = await axios.post("/api/Accounts/Register", data)
      return response
    } catch (error) {
      return error.response
    }
  }

  update = async (obj) => {
    try {
      const response = await axios.put("/api/Accounts/UpdateUserStatus", obj)
      return response
    } catch (error) {
      return error.response
    }
  }

  delete = async (id) => {
    try {
      debugger
      const response = await axios.patch(`/api/Accounts/DeleteUser?id=${id}`)
      return response
    } catch (error) {
      return error.response
    }
  }
  uploadImage = async (userId, data) =>{
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    }
    try{
      const response = await axios.post(`/api/Accounts/UploadProfilePic?userId=${userId}`, data, config)
      return response
    } catch(error){
      return error.response
    }
  }
}
