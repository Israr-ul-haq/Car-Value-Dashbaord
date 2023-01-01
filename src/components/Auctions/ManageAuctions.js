import React from "react"
import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Loader from "../../shared/Loader"
import downloadCSV from "../../shared/CSV"
import "jspdf-autotable"
import jsPDF from "jspdf"
import deleteItem from "../../shared/DeleteItem"
import AuctionService from "../../Services/AuctionService"

const ManageAuctions = () => {
  // SERVICES

  //State
  const auctionServices = new AuctionService()
  //State
  const [data, setData] = useState([])
  const [loader, setLoader] = useState(false)
  const [dataCount, setDataCount] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)

  const columnNames = [
    {
      auctionName: "Auction 1",
      startDate: "21 Oct 2021",
      endDate: "25 Oct 2021",
      totalVehicles: 0,
      totalBids: 0,
      status: "Open",
      winner: "",
    },
  ]
  const columns = [
    {
      name: "No#",
      cell: (row, index) => index + 1,
      sortable: true,
      width: "80px",
      maxWidth: "80px",
    },

    {
      name: "Auction Names",
      selector: "auctionName",
      sortable: true,
    },
    {
      name: "Start Date",
      selector: "startDate",
      sortable: true,
    },

    {
      name: "End Date",
      selector: "endDate",
      sortable: true,
    },
    {
      name: "No of Vehicle",
      selector: "totalVehicles",
      sortable: true,
    },
    {
      name: "Status",

      cell: (row) => (
        <p>
          {row.status === "Open" ? (
            <span style={{ color: "green" }}>Open</span>
          ) : row.status === "Close" ? (
            <span style={{ color: "red" }}>Close</span>
          ) : row.status === "Upcoming" ? (
            <span style={{ color: "#ffd700" }}>Upcoming</span>
          ) : (
            ""
          )}
        </p>
      ),
    },
    {
      name: "Winner",
      selector: "winner",
      sortable: true,
    },
    {
      name: "Total Bids",
      selector: "totalBids",
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="tableactions">
          <Link to={`/PeopleBids/${row.auctionId}`} className="TableEdit">
            <img alt="table-action" className="tableactions_image" src="./img/Bid Icon.svg" />
          </Link>
          <Link to={`/ViewAuctions/${row.auctionId}`} className="TableEdit">
            <img src="./img/view.svg" alt="event" />
          </Link>
          <Link to={`/EditAuction/${row.auctionId}`} className="TableEdit">
            <img alt="table-action" className="tableactions_image" src="./img/Edit.svg" />
          </Link>
          <button
            type="button"
            data-toggle="modal"
            class="tableactions_action"
            onClick={() => deleteItem(row.auctionId, data, auctionServices, "Auction", setLoader, "auctionId")}
          >
            <img alt="table-action" class="tableactions_image" src="./img/Delete.svg" />
          </button>
        </div>
      ),
    },
  ]

  //UseEffect
  useEffect(() => {
    if (dataCount === 0) {
      getAuctions(1)
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const getAuctions = async (page) => {
    debugger
    setLoader(true)
    const response = await auctionServices.get(page, perPage, "")
    const totalRows = await auctionServices.get(1, 0, "")
    setData(response.data.data)
    setTotalRows(totalRows.data.data.length)
    setLoader(false)
  }

  const exportPDF = () => {
    const unit = "pt"
    const size = "A4" // Use A1, A2, A3 or A4
    const orientation = "portrait" // portrait or landscape
    let status = ""
    const marginLeft = 40
    const doc = new jsPDF(orientation, unit, size)

    doc.setFontSize(15)

    const title = "Auctions"
    const headers = [["Auction Name", "StartDate", "End Date", "Vehicles", "Total Bids"]]

    const pdfData = data.map((elt) => {
      status = elt.status === 2 ? "Open" : "Closed"
      return [elt.auctionName, elt.startDate, elt.endDate, elt.totalVehicles, elt.totalBids, status]
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

  const search = async (search) => {
    setLoader(true)
    if (search === "") {
      const response = await auctionServices.get(1, 10, "")
      setData(response.data.data)
      const totalRows = await auctionServices.get(1, 0, "")
      setData(response.data.data)
      setTotalRows(totalRows.data.data.length)
      setLoader(false)
    } else {
      const response = await auctionServices.get(1, 10, search)
      setData(response.data.data)
      setTotalRows(response.data.data.length)
      setLoader(false)
    }
  }
  const handlePageChange = (page) => {
    setLoader(true)
    getAuctions(page)
    setLoader(false)
  }

  const handlePerRowsChange = async (newPerPage, pageSize) => {
    setLoader(true)
    const response = await auctionServices.get(pageSize, newPerPage, "")
    setData(response.data.data)
    setPerPage(newPerPage)
    setLoader(false)
  }

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <h1 className="headertopbar_title">Auctions</h1>
                <Link to="/AddNewAuctions" className="headertopbar_btn btn_primary">
                  Add
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                {" "}
                <div className="datatableheading">Export to:</div>
                <div>
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => exportPDF()}>
                    PDF
                  </button>
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames, "Auctions")}>
                    CSV
                  </button>
                </div>
                <input
                  className="tablesearchbox"
                  type="text"
                  placeholder="Search"
                  aria-label="Search Input"
                  onChange={(e) => search(e.target.value)}
                />
                {loader ? (
                  Loader
                ) : (
                  <DataTable
                    title=""
                    columns={columns}
                    data={data}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    progressPending={loader}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ManageAuctions
