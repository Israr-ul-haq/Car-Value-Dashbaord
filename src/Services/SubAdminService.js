import axios from "../shared/AxiosConfig"

export default class SubAdminService {
  post = async () => {
    try {
      const response = await axios.post("/api/Accounts/Register")
      return response
    } catch (error) {
      return error.response
    }
  }
}
