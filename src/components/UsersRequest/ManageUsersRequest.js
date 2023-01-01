import React from "react"
import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import UsersService from "../../Services/UsersServices"
import Loader from "../../shared/Loader"
import downloadCSV from "../../shared/CSV"
import "jspdf-autotable"
import jsPDF from "jspdf"
import deleteItem from "../../shared/DeleteItem"
import { UserStatus } from "../constants/UserStatus"


const ManageUsersRequest = () => {
  // SERVICES
  const usersServices = new UsersService()
  //State
  const [data, setData] = useState([])
  const [loader, setLoader] = useState(true)
  const [dataCount, setDataCount] = useState(0)

  const columnNames = [
    {
      fullName: "string",
      email: "user2@example.com",
      phoneNumber: "string",
    },
  ]
  const columns = [
    {
      name: "No#",
      cell: (row, index) => index + 1,
      sortable: true,
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
      name: "Phone Number",
      selector: "phoneNumber",
      sortable: true,
    },

    {
      name: "Status",
      cell: (row) => (
        <p>
          {row.userStatusId === UserStatus.Approved ? (
            <span style={{ color: "green" }}>Approve</span>
          ) : row.userStatusId === UserStatus.Pending ? (
            <span style={{ color: "red" }}>Pending</span>
          ) : (
            <span style={{ color: "red" }}>Rejected</span>
          )}
        </p>
      ),
    },

    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="tableactions">
          <Link to={`/ViewUsersRequest/${row.id}`} className="TableEdit">
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
      getUsers()
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const getUsers = async () => {
    setLoader(true)
    const response = await usersServices.get()
    const finalAdmins = []
    debugger
    response.data.data.forEach((element) => {
      if (element.userRole === "AppUser") {
        finalAdmins.push(element)
      }
    })
    setData(finalAdmins)
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

    const title = "Users"
    const headers = [["User Name", "Email", "Phone", "Status"]]

    const pdfData = data.map((elt) => {
      status = elt.userStatusId === 1 ? "Approved" : "Rejected"
      return [elt.fullName, elt.email, elt.phoneNumber, status]
    })

    let content = {
      startY: 50,
      head: headers,
      body: pdfData,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save("User.pdf")
  }

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <h1 className="headertopbar_title"> Users Request</h1>
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

export default ManageUsersRequest
