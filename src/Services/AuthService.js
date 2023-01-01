import axios from "../shared/AxiosConfig"

export default class AuthService {
  login = async (data) => {
    try {
      const response = await axios.post("/api/Accounts/login", data)
      return response
    } catch (error) {
      return error
    }
  }
}
