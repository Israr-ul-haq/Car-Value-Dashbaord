import React, { useState, useEffect } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css"
import DataTable from "react-data-table-component"
import downloadCSV from "../../shared/CSV"
import "react-datepicker/dist/react-datepicker.css"
import AuctionService from "../../Services/AuctionService"
import "jspdf-autotable"
import jsPDF from "jspdf"
import Swal from "sweetalert2"
import Loader from "../../shared/Loader"
import moment from "moment"

function PeopleBids() {
  // SERVICES

  //State
  const auctionService = new AuctionService()
  const { auctionId } = useParams()

  const [auctionDetail, setAuctionDetail] = useState({})
  const [auctionCount, setAuctionCount] = useState(0)
  const [btnLock, setBtnLock] = useState(false)
  const [bidBtnLock, setBidBtnLock] = useState(false)
  const [loader, setLoader] = useState(true)
  const [winner, setWinner] = useState([
    {
      announcedBy: JSON.parse(localStorage.getItem("carvalueuser")),
      auctionId: "",
      userId: ""
    },
  ])
  const [data, setData] = useState([
    {
      bidId: "",
      Name: "Adam Hawkins",
      Email: "admin@gmail.com",
      Phone: "(382)694-8601",
    },
  ])
  useEffect(() => {
    if (auctionCount === 0) {
      getAuction()
      setAuctionCount(1)
    }
  }, [auctionCount]) // eslint-disable-line react-hooks/exhaustive-deps
  const getAuction = async () => {
    try {
      setBtnLock(true)
      const response = await auctionService.getItems(auctionId)
      if (response.data.code === 1) {
        setBtnLock(false)
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
  useEffect(() => {
    if (auctionCount === 0) {
      getPeopleBids()
      setAuctionCount(1)
    }
  }, [auctionCount]) // eslint-disable-line react-hooks/exhaustive-deps

  const getPeopleBids = async (id) => {
    try {
      setBtnLock(true)
      const response = await auctionService.getPeopleBids(auctionId)
      if (response.data.code === 1) {
        setBtnLock(false)
        setData(response.data.data)
        setLoader(false)

        const isWinner = response.data.data.find(x => x.isWinner === true);

        if (isWinner !== null || isWinner !== undefined) {
          setBidBtnLock(isWinner);
        }


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


  function bidWinnerSelector(userId) {
    Swal.fire({
      title: "Are you sure you want to select the winner",
      showCancelButton: true,
      confirmButtonText: `Yes`,
      showCloseButton: true,
      closeButtonHtml: '<img src="./img/Icon material-cancel.png" alt="crossicon" className="popupcrossimage"/>',
      reverseButtons: true,
    }).then(async (result) => {
      debugger
      if (result.isConfirmed) {
        try {
          const response = await auctionService.bidWinner(winner[0].announcedBy, auctionId, userId)
          if (response.data.code === 1) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Winner Selected",
            })

            await getPeopleBids();

            setWinner(response.data.data)
          }
          if (response.data.code === 0) {
            Swal.fire({
              icon: "error",
              title: "error",
              text: "Winner already announced",
            })
          }
        } catch (error) {
          setBtnLock(false)
          Swal.fire({
            position: "center",
            icon: "error",
            title: error.data.data.message,
            showConfirmButton: true,
            timer: 5000,
          })
        }
      } else if (result.isDenied) {
        Swal.fire({
          position: "center",
          icon: "error",
          text: "Winner already announced",
          showConfirmButton: true,
          timer: 5000,
        })
      }
    })
  }

  const columnNames = [
    {
      fullName: "",
      email: "",
      totalBidsAmount: "",
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
      cell: (row) => <img style={{ width: "25px" }} src={row.profilePic ? row.profilePic : "/img/images.png"} alt="profile" />,
    },
    {
      name: "Name",
      selector: "fullName",
      sortable: true,
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
    },
    {
      name: "Bid Amount",
      selector: "totalBidsAmount",
      sortable: true,
    },

    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="tableactions">
          <Link to={`/ViewPeopleBid/${row.createdBy}/${auctionId}`} className="TableEdit">
            <img src="./img/view.svg" alt="event" />
          </Link>
          {/* <button type="button" data-toggle="modal" class="tableactions_action" onClick={() => bidWinnerSelector(row.bidId)} id={row.bidId}> */}

          {row.isWinner ? <button type="button" disabled={bidBtnLock} data-toggle="modal" class="tableactions_action" onClick={() => bidWinnerSelector(row.createdBy)}>
            <img alt="table-action" className="tableactions_image tableactions_image_nonaproved" src="./img/Approve Icon.svg" />
          </button> :<button type="button" disabled={bidBtnLock} data-toggle="modal" class="tableactions_action" onClick={() => bidWinnerSelector(row.createdBy)}>
            <img alt="table-action" className="tableactions_image tableactions_image_nonaproved" src="./img/Before approval icon.svg" />
          </button>}

        </div>
      ),
    },
  ]

  const exportPDF = () => {
    const unit = "pt"
    const size = "A4" // Use A1, A2, A3 or A4
    const orientation = "portrait" // portrait or landscape
    const marginLeft = 40
    const doc = new jsPDF(orientation, unit, size)

    doc.setFontSize(15)

    const title = "People Bids"
    const headers = [["Name", "Email", "Total Bids Amount"]]

    const pdfData = data.map((elt) => {
      return [elt.fullName, elt.email, elt.totalBidsAmount]
    })

    let content = {
      startY: 50,
      head: headers,
      body: pdfData,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save("PeopleBids.pdf")
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
                  <h1 className="headertopbar_title">People Bids</h1>
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
                          {/* <img
                          style={{ width: "60%", height: "166px", borderRadius: "15px" }}
                          className="auction-image"
                          alt="event_image"
                          src="./img/Profile.png"
                        /> */}
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
                          <h3 className="view-profile-name">Based Fee</h3>
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
                {" "}
                <div className="datatableheading">Export to:</div>
                <div>
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => exportPDF()}>
                    PDF
                  </button>
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames, "People Bids")}>
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
export default PeopleBids
