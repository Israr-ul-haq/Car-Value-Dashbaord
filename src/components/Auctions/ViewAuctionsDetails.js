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
import moment from "moment"
import jsPDF from "jspdf"

function ViewAuctions() {
  // SERVICES
  const auctionService = new AuctionService()
  const [auctionDetail, setAuctionDetail] = useState({})
  const [auctionCount, setAuctionCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const { auctionId } = useParams()
  const [btnLock, setBtnLock] = useState(false)

  useEffect(() => {
    if (auctionCount === 0) {
      getAuction()
      setAuctionCount(1)
    }
  }, [auctionCount]) // eslint-disable-line react-hooks/exhaustive-deps

  const getAuction = async () => {
    debugger
    try {
      setBtnLock(true)
      const response = await auctionService.getItems(auctionId)
      if (response.data.code === 1) {
        setBtnLock(false)
        debugger
        setData(response.data.data.auctionItems)
        setAuctionDetail(response.data.data.auctions[0])
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

  //State
  const [data, setData] = useState([
    {
      index: "1",
      photo: "",
      MakeBrand: "Honda",
      Modal: "2020",
      Mileage: "30km",
    },
  ])

  const columnNames = [
    {
      make: "Honda",
      model: "2020",
      mileage: "30km",
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
      cell: (row) => (
        <img
          style={{ width: "25px" }}
          src={row.auctionItemPic? row.auctionItemPic : "/img/images.png" }
          alt="profile"
        />
      ),
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
  ]
  const exportPDF = () => {
    const unit = "pt"
    const size = "A4" // Use A1, A2, A3 or A4
    const orientation = "portrait" // portrait or landscape
    const marginLeft = 40
    const doc = new jsPDF(orientation, unit, size)

    doc.setFontSize(15)

    const title = "Users"
    const headers = [["Make Brand", "Model", "Mileage"]]

    const pdfData = data.map((elt) => {
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
                <Link className="arrow-container_link" to="/ManageAuctions">
                  <img className="arrow-container_image" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.svg" />
                  <h1 className="headertopbar_title">Auction Details</h1>
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                {loader ? (
                  Loader
                ) : (
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="edit-icon-contain">
                            <h5 className="image-top-headline">Auction details</h5>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <img
                            style={{ width: "60%", height: "166px", borderRadius: "15px" }}
                            className="auction-image"
                            alt="event_image"
                            src={auctionDetail.auctionPic ? auctionDetail.auctionPic : "/img/images.png"}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Auction Name</h3>
                          <h4 className="view-profile-user-name">{auctionDetail.auctionName}</h4>
                        </div>
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Auction Start Date</h3>
                          <h4 className="view-profile-user-name">{moment(auctionDetail.startDate).format("L")}</h4>
                        </div>

                        <div className="col-md-4">
                          <div className="auction-pad-bottom">
                            <h3 className="view-profile-name">Auction End Date</h3>
                            <h4 className="view-profile-user-name">{moment(auctionDetail.endDate).format("L")}</h4>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Auction Fee</h3>
                          <h4 className="view-profile-user-name">{auctionDetail.auctionFee}</h4>
                        </div>
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Base Fee</h3>
                          <h4 className="view-profile-user-name">{auctionDetail.basePrice}</h4>
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
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames, "Auctions")}>
                    CSV
                  </button>
                </div>
                <input className="tablesearchbox" type="text" placeholder="Search" aria-label="Search Input" />
                {loader ? Loader : <DataTable title="" columns={columns} data={data} pagination />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
export default ViewAuctions
