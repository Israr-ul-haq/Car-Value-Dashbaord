import axios from "../shared/AxiosConfig"
export default class ItemServiceDelete {
    delete = async (id) => {
        try {
          debugger
          const response = await axios.patch(`/api/AuctionItems/DeleteAuctionItem?AuctionItemId=${id}`)
          return response
        } catch (error) {
          return error.response
        }
      }
}