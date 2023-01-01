import axios from "../shared/AxiosConfig"
export default class AuctionService {
  save = async (data) => {
    try {
      const response = await axios.post("/api/Auctions/CreateAuction", data)
      return response
    } catch (error) {
      return error.response
    }
  }

  getPeopleBids = async (auctionId) => {
    try {
      const response = await axios.get(`/api/Bids/PopulateBidListByAuctionId?auctionId=${auctionId}`)
      return response
    } catch (error) {
      return error.response
    }
  }
  get = async (index=0,pageSize=0,search="") => {
    try {
      const response = await axios.get(`/api/Auctions/PopulateAuctionsList?pageNumber=${index}&pageSize=${pageSize}&keyword=${search}`)
      return response
    } catch (error) {
      return error.response
    }
  }
  getBids = async (createdBy, auctionId) => {
    try {
      const response = await axios.get(`/api/Bids/PopulateItemWiseBiddingDetails?userId=${createdBy}&auctionId=${auctionId}`)
      return response
    } catch (error) {
      return error.response
    }
  }

  getItems = async (auctionId) => {
    try {
      const response = await axios.get(`/api/Auctions/PopulateAuctionDetailsByAuctionId/?AuctionId=${auctionId}`)
      return response
    } catch (error) {
      return error.response
    }
  }

  Add = async (data) => {
    try {
      const response = await axios.post("/api/AuctionItems/AddAuctionItems", data)
      return response
    } catch (error) {
      return error.response
    }
  }

  delete = async (auctionId) => {
    try {
      debugger
      const response = await axios.patch(`/api/Auctions/DeleteAuction?AuctionId=${auctionId}`)
      return response
    } catch (error) {
      return error.response
    }
  }
  updateItem = async (data) => {
    try {
      const response = await axios.put("/api/AuctionItems/UpdateAuctionItem", data)
      return response
    } catch (error) {
      return error.response
    }
  }
  updateAuction = async (data) => {
    debugger
    try {
      debugger

      const response = await axios.put("/api/Auctions/UpdateAuctionDetails", data)
      return response
    } catch (error) {
      return error.response
    }
  }
  bidWinner = async (announcedBy, auctionId, userId) => {
    try {
      const response = await axios.patch("/api/Bids/MakeWinner", { announcedBy, auctionId, userId})
      return response
    } catch (error) {
      return error.response
    }
  }
  postImportFileItem = async (data) => {
    try {
      const response = await axios.post("/api/AuctionItems/AddAuctionItemsList", data)
      return response
    } catch (error) {
      return error.response
    }
  }
  uploadImage = async (auctionId, data) =>{
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    }
    try{
      const response = await axios.post(`/api/Auctions/UploadAuctionPic/?auctionId=${auctionId}`, data, config)
      return response
    } catch(error){
      return error.response
    }
  }
  uploadImageItem = async (auctionItemsId, data) =>{
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    }
    try{
      const response = await axios.post(`/api/AuctionItems/UploadAuctionItemPic?auctionItemId=${auctionItemsId}`, data, config)
      return response
    } catch(error){
      return error.response
    }
  }
}
