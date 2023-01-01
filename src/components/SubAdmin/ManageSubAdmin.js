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

const ManageSubAdmin = () => {
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
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="tableactions">
          <Link to={`/ViewSubAdmin/${row.id}`} className="TableEdit">
            <img src="./img/view.svg" alt="event" />
          </Link>
          <Link to={`/EditSubAdmin/${row.id}`} className="TableEdit">
            <img alt="table-action" className="tableactions_image" src="./img/Edit.svg" />
          </Link>
          <button type="button" data-toggle="modal" class="tableactions_action">
            <img
              alt="table-action"
              class="tableactions_image"
              src="./img/Delete.svg"
              onClick={() => deleteItem(row.id, data, usersServices, "SubAdmin", setLoader, "subAdminId")}
            />
          </button>
        </div>
      ),
    },
  ]

  useEffect(() => {
    if (dataCount === 0) {
      getUsers()
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const getUsers = async () => {
    debugger
    setLoader(true)
    const response = await usersServices.get()
    const finalAdmins = []

    response.data.data.forEach((element) => {
      if (element.userRole === "SuperAdmin") {
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
    const headers = [["User Name", "Email", "Phone"]]

    const pdfData = data.map((elt) => {
      return [elt.fullName, elt.email, elt.phoneNumber]
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

  const search = async (search) => {
    debugger
    setLoader(true)
    const response = await usersServices.get(0,0,search)
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
                <h1 className="headertopbar_title"> Manage SubAdmin</h1>
                <Link to="/AddNewSubAdmin" className="headertopbar_btn btn_primary">
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
                    PDF{" "}
                  </button>
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames, "SubAdmin")}>
                    CSV
                  </button>
                </div>
                <input className="tablesearchbox" type="text" placeholder="Search" aria-label="Search Input"
               onChange={(e) =>search(e.target.value)} />
                {loader ? (
                  Loader
                ) : (
                  <>
                    <DataTable title="" columns={columns} data={data} pagination />
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

export default ManageSubAdmin
