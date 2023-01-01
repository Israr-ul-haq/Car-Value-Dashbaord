import axios from "../shared/AxiosConfig"

export default class DashBoardService {
  get = async () => {
    try {
      const response = await axios.get("/api/Dashboard/PopulateDashboardStats")

      return response
    } catch (error) {
      return error.response
    }
  }

  getAuctionStats = async () => {
    try {
      const response = await axios.get("/api/Dashboard/PopulateMonthwiseAuctionStats")
      return response
    } catch (error) {
      return error.response
    }
  }
  getBiddingStats = async () => {
    try {
      const response = await axios.get("/api/Dashboard/PopulateMonthwiseBiddingStats")
      return response
    } catch (error) {
      return error.response
    }
  }
}
