import React from "react"
import DataTable from "react-data-table-component"
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import downloadCSV from "../../shared/CSV"

import "jspdf-autotable"
import jsPDF from "jspdf"
import PaymentService from "../../Services/PaymentServices"
import Loader from "../../shared/Loader"

const ViewPayments = () => {
  const paymentService = new PaymentService()
  const { auctionId } = useParams()
  // SERVICES

  //State
  const [data, setData] = useState([])
  const [dataCount, setDataCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const columnNames = [
    {
      fullName: "Cycle Owner",
      email: "Blue Avenue",
      price: "123-124-122128",
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
          src={row.profilePic ? row.profilePic : "/img/images.png"}
          alt="profile"
        />
      ),
      grow: 0,
    },

    {
      name: "Full Name",
      selector: "fullName",
      sortable: true,
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
    },
    {
      name: "Price",
      selector: "price",
      sortable: true,
    },
  ]

  //UseEffect

  const exportPDF = () => {
    const unit = "pt"
    const size = "A4" // Use A1, A2, A3 or A4
    const orientation = "portrait" // portrait or landscape

    const marginLeft = 40
    const doc = new jsPDF(orientation, unit, size)

    doc.setFontSize(15)

    const title = "Users payments"
    const headers = [["Full Name", "Email", "Price"]]
    const pdfData = data.map((elt) => {
      return [elt.fullName, elt.email, elt.price]
    })
    let content = {
      startY: 50,
      head: headers,
      body: pdfData
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save("User.pdf")
  }
  useEffect(() => {
    if (dataCount === 0) {
      getUserPayments()
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  const getUserPayments = async () => {
    setLoader(true)
    debugger
    const response = await paymentService.getPayments(auctionId)
    setData(response.data.data)
    setLoader(false)
  }
  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <Link to="/ManagePayments" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.svg" /> Payments
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
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames, "Users Requests")}>
                    CSV
                  </button>
                </div>
                {loader ? (Loader) : (
                  <>
                    <input className="tablesearchbox" type="text" placeholder="Search" aria-label="Search Input" />
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

export default ViewPayments
