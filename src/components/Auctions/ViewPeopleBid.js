import React, { useState, useEffect } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css"
import DataTable from "react-data-table-component"
import downloadCSV from "../../shared/CSV"
import "react-datepicker/dist/react-datepicker.css"
import "jspdf-autotable"
import AuctionService from "../../Services/AuctionService"
import Swal from "sweetalert2"
import Loader from "../../shared/Loader"
import jsPDF from "jspdf"

function ViewPeopleBid() {
  const auctionService = new AuctionService()
  const [bidderDetail, setBidderDetail] = useState({})
  const [bidderCount, setBidderCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const { createdBy, auctionId } = useParams()
  const [bidItem, setBidItem] = useState([
    {
      itemPic: "",
      auctionId: "",
      make: "",
      bidAmountId: "",
      auctionItemId: "",
      model: "Honda",
      mileage: "2020",
      price: "30km",
    },
  ])
  const [btnLock, setBtnLock] = useState(false)

  //Functions
  useEffect(() => {
    if (bidderCount === 0) {
      getBidderDetails()
      setBidderCount(1)
    }
  }, [bidderCount]) // eslint-disable-line react-hooks/exhaustive-deps

  const getBidderDetails = async () => {
    debugger
    try {
      setBtnLock(true)
      const response = await auctionService.getBids(createdBy, auctionId)
      if (response.data.code === 1) {
        setBtnLock(false)
        setBidderDetail(response.data.data.bidderDetailsModel)
        setBidItem(response.data.data.biddingItemsLists)
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
  const columnNames = [
    {
      make: "",
      model: "",
      mileage: "",
    },
  ]
  const columns = [
    {
      name: "No#",
      cell: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Photo",
      button: true,
      cell: (row) => <img style={{ width: "25px" }} src={row.itemPic ? row.itemPic : "/img/images.png"} alt="profile" />,
      grow: 0,
    },

    {
      name: "Make Brand",
      selector: "make",
      sortable: true,
    },
    {
      name: "Model",
      selector: "model",
      sortable: true,
    },

    {
      name: "Mileage",
      selector: "mileage",
      sortable: true,
    },
    {
      name: "Price",
      selector: "price",
      sortable: true,
    },
  ]
  const exportPDF = () => {
    const unit = "pt"
    const size = "A4" // Use A1, A2, A3 or A4
    const orientation = "portrait" // portrait or landscape

    const marginLeft = 40
    const doc = new jsPDF(orientation, unit, size)

    doc.setFontSize(15)

    const title = "Person Bids"
    const headers = [["Make Brands", "Model", "Mileage"]]

    const pdfData = bidItem.map((elt) => {
      return [elt.make, elt.model, elt.mileage]
    })

    let content = {
      startY: 50,
      head: headers,
      body: pdfData,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save("Auction.pdf")
  }

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <Link className="arrow-container_link" to={`/peopleBids/${auctionId}`}>
                  <img className="arrow-container_image" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.svg" />
                  <h1 className="headertopbar_title">{bidderDetail.fullName} Details</h1>
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
                      <img style={{ width: "76%", height: "175px", borderRadius: "15px" }} alt="event_image" src={bidderDetail.profilePicName} />
                    </div>

                    <div className="col-md-3 ">
                      <h3 className="view-profile-name">Full Name</h3>
                      <h4 className="view-profile-user-name">{bidderDetail.fullName}</h4>
                      {/* <div className="view-bid-email">
                      <h3 className="view-profile-name">Date</h3>
                      <h4 className="view-profile-user-name">09/05/2020</h4>
                    </div> */}
                      <div className="view-bid-email">
                        <h3 className="view-profile-name">Auction Name</h3>
                        <h4 className="view-profile-user-name">{bidderDetail.auctionName}</h4>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <h3 className="view-profile-name">Email</h3>
                      <h4 className="view-profile-user-name">{bidderDetail.email} </h4>
                      <div className="view-bid-email">
                        <h3 className="view-profile-name">No of Cars</h3>
                        <h4 className="view-profile-user-name">{bidderDetail.noOfCars}</h4>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <h3 className="view-profile-name">Bid Amount</h3>
                      <h4 className="view-profile-user-name">{bidderDetail.bidAmount}</h4>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <main className="main-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 column_margin">
              <div className="card_custom">
                <div className="row">
                  <div className="col-lg-8">
                    <h5 className="custom-card-heading">Vahicle Information</h5>
                  </div>
                </div>{" "}
                <div className="datatableheading">Export to:</div>
                <div>
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => exportPDF()}>
                    PDF
                  </button>
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(bidItem, columnNames, "Person vahicles")}>
                    CSV
                  </button>
                </div>
                <input className="tablesearchbox" type="text" placeholder="Search" aria-label="Search Input" />
                {loader ? Loader : <DataTable title="" columns={columns} data={bidItem} pagination />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
export default ViewPeopleBid
