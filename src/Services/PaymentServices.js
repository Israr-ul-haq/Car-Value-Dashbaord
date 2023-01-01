import axios from "../shared/AxiosConfig"

export default class PaymentService {
  get = async () => {
    try {
      const response = await axios.get("/api/Payments/PopulatePaymentDetails")
      return response
    } catch (error) {
      return error.response
    }
  }
  getPayments = async (auctionId) => {
    try {
      const response = await axios.get(`/api/Accounts/PopulateUsersPymentListByAuctionId?auctionId=${auctionId}`)
      return response
    } catch (error) {
      return error.response
    }
  }
}