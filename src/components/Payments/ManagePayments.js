import React, { useLayoutEffect } from "react"
import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import PaymentService from "../../Services/PaymentServices"
import Loader from "../../shared/Loader"
import downloadCSV from "../../shared/CSV"

import "jspdf-autotable"
import jsPDF from "jspdf"

const ManagePayments = () => {
  // SERVICES
const paymentService = new PaymentService()
const [loader, setLoader] = useState(true)
  //State
  const [data, setData] = useState([
  ])
  const [dataCount, setDataCount] = useState(0)
  const columnNames = [
    {
      auctionName: "Cycle Owner",
      auctionFee: "Blue Avenue",
      totalBids: "123-124-122128",
      totalRevenue: "Peco Road",
    },
  ]
  const columns = [
    {
      name: "No#",
      cell: (row, index) => index + 1,
      sortable: true,
    },
    {
        name: "Auction Name",
        selector: "auctionName",
        sortable: true,
      },

    {
      name: "Entry Fee",
      selector: "auctionFee",
      sortable: true,
    },

    {
      name: "Total Bids",
      selector: "totalBids",
      sortable: true,
    },

    {
      name: "Total Revenue",
      selector: "totalRevenue",
      sortable: true,
    },
    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="tableactions">
          <Link to={`/ViewPayments/${row.auctionId}`} className="TableEdit">
            <img src="./img/View Icon.svg" alt="event" />
          </Link>
        </div>
      ),
      grow: 0,
    },
  ]

  //UseEffect
  useEffect(() => {
    if (dataCount === 0) {
    getPayment()
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

const getPayment = async () =>{
  setLoader(true)
  const response = await paymentService.get()
  setData(response.data.data)
  setLoader(false)
}
  

  const exportPDF = () => {
    const unit = "pt"
    const size = "A4" // Use A1, A2, A3 or A4
    const orientation = "portrait" // portrait or landscape

    const marginLeft = 40
    const doc = new jsPDF(orientation, unit, size)

    doc.setFontSize(15)

    const title = "Payments"
    const headers = [["Auction Name", "Entry Fee", "Total Bids", "Total Revenue"]]
    const pdfData = data.map((elt) => {
      return [elt.auctionName, elt.auctionFee, elt.totalBids, elt.totalRevenue]
    })

    let content = {
      startY: 50,
      head: headers,
      body: pdfData,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save("Payments.pdf")
  }



  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <h1 className="headertopbar_title">Payment</h1>
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
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data,columnNames, "Payments")}>
                    CSV
                  </button>
                </div>
                <input className="tablesearchbox" type="text" placeholder="Search" aria-label="Search Input" />
                {loader ? (
                  Loader
                ) : (
                  <>
                <DataTable title="" data={data} columns={columns} pagination />

              </>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ManagePayments
