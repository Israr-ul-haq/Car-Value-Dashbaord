import React, { useState, useEffect } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import "react-datepicker/dist/react-datepicker.css"
import DataTable from "react-data-table-component"
import downloadCSV from "../../shared/CSV"
import "react-datepicker/dist/react-datepicker.css"
import AuctionService from "../../Services/AuctionService"
import DatePicker from "react-datepicker"
import Swal from "sweetalert2"
import Loader from "../../shared/Loader"
import moment from "moment"
import "jspdf-autotable"
import jsPDF from "jspdf"
import deleteItem from "../../shared/DeleteItem"
import { CSVReader } from "react-papaparse"
import ItemServiceDelete from "../../Services/ItemServiceDelete"
import { AuctionStatus } from "../constants/AuctionStatus"

function EditAuctions() {
  // SERVICES
  const buttonRef = React.createRef()
  const auctionService = new AuctionService()
  const itemServiceDelete = new ItemServiceDelete()
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [auctionCount, setAuctionCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const history = useHistory()
  const [editAuction, setEditAuction] = useState({})
  const { auctionId } = useParams()
  const [image, setImage] = useState(false)
  const [btnLock, setBtnLock] = useState(false)
  const [editAuctionItem, setEditAuctionItem] = useState({})
  const [auctionsImageData, setAuctionsImageData] = useState("/img/icon_upload_add_load.svg")
  const [itemsImageData, setItemsImageData] = useState("/img/icon_upload_add_load.svg")
  const [items, setItems] = useState([
    {
      index: "1",
      photo: "",
      MakeBrand: "Honda",
      Modal: "2020",
      mileage: "30km",
    },
  ])
  const [auctionPicture, setAuctionPicture] = useState(null)
  const [itemPicture, setItemPicture] = useState(null)

  const auctionImagesPreview = (e) => {
    debugger
    if (e.target.files[0]) {
      setAuctionPicture(e.target.files[0])
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setAuctionsImageData(reader.result)
        setImage(reader.result)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }
  const itemsImagesPreview = (e) => {
    debugger
    if (e.target.files[0]) {
      setItemPicture(e.target.files[0])
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setItemsImageData(reader.result)
        setImage(reader.result)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }
  const [editItemsImageData, setEditItemsImageData] = useState("/img/icon_upload_add_load.svg")
  const [editItemPicture, setEditItemPicture] = useState(null)

  const EdititemsImagesPreview = (e) => {
    debugger
    if (e.target.files[0]) {
      setEditItemPicture(e.target.files[0])
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setEditItemsImageData(reader.result)
        setImage(reader.result)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const [emptyValidation, setEmptyValidation] = useState({
    auctionNameEmpty: false,
    auctionFeeEmpty: false,
    basePriceEmpty: false,
    startDateEmpty: false,
    endDateEmpty: false,
    auctionStatusIdEmpty: false,
  })

  useEffect(() => {}, [emptyValidation, editAuction, auctionsImageData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    let validCount = 0
    editAuction.startDate = startDate
    editAuction.endDate = endDate
    const c = { ...emptyValidation }

    if (editAuction.auctionName === "") {
      c.auctionNameEmpty = true
      validCount++
    } else {
      c.auctionNameEmpty = false
    }

    if (editAuction.auctionFee === "") {
      c.auctionFeeEmpty = true
      validCount++
    } else {
      c.auctionFeeEmpty = false
    }

    if (editAuction.basePrice === "") {
      c.basePriceEmpty = true
      validCount++
    } else {
      c.basePriceEmpty = false
    }
    if (editAuction.startDate === "") {
      c.startDateEmpty = true
      validCount++
    } else {
      c.startDateEmpty = false
    }
    if (editAuction.endDate === "") {
      c.endDateEmpty = true
      validCount++
    } else {
      c.endDateEmpty = false
    }
    if (editAuction.auctionStatusId === 0) {
      c.auctionStatusIdEmpty = true
      validCount++
    } else {
      c.auctionStatusIdEmpty = false
    }

    let startDateFlag = moment(editAuction.startDate).format("MM-DD-YYYY")
    let endDateFlag = moment(editAuction.endDate).format("MM-DD-YYYY")
    debugger
    if (endDateFlag < startDateFlag) {
      c.startDateEmpty = "End date must be greater than start date"
      validCount++
    } else {
      c.startDateEmpty = ""
    }

    setEmptyValidation(c)

    if (validCount > 0) {
      return
    }
    setBtnLock(true)

    let format = "MM-DD-YYYY"

    let finalEditAuction = {}
    debugger
    if (editAuction.auctionStatusId === undefined) {
      if (editAuction.status.toLowerCase() === "open") {
        finalEditAuction.auctionStatusId = AuctionStatus.Open
      } else if (editAuction.status.toLowerCase() === "upcoming") {
        finalEditAuction.auctionStatusId = AuctionStatus.Upcoming
      }
    } else finalEditAuction.auctionStatusId = editAuction.auctionStatusId

    finalEditAuction.startDate = moment(editAuction.startDate).format(format)
    finalEditAuction.endDate = moment(editAuction.endDate).format(format)

    finalEditAuction.updatedBy = JSON.parse(localStorage.getItem("carvalueuser"))
    finalEditAuction.auctionPicName = auctionsImageData
    finalEditAuction.basePrice = editAuction.basePrice
    finalEditAuction.auctionFee = editAuction.auctionFee
    finalEditAuction.auctionName = editAuction.auctionName
    finalEditAuction.auctionId = editAuction.auctionId
    const response = await auctionService.updateAuction(finalEditAuction)
    debugger
    const copy = { ...auctionItem }
    copy.auctionId = response.data.data.auctionId
    setAuctionItem(copy)
    if (response.data.code === 1) {
      debugger
      if (!(auctionPicture === null)) {
        const formData = new FormData()
        formData.append("ProfilePics", auctionPicture)
        const auctionImageResponse = await auctionService.uploadImage(response.data.data.auctionId, formData)

        if (auctionImageResponse.data.code === 1) {
          const response = await auctionService.getItems(auctionId)
          setItems(response.data.data.auctionItems)
          setEditAuction(response.data.data.auctions[0])

          setStartDate(new Date(response.data.data.auctions[0].startDate))
          setEndDate(new Date(response.data.data.auctions[0].endDate))
          setAuctionsImageData(response.data.data.auctions[0].auctionPic)
          setBtnLock(false)
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Auction has been updated",
            showConfirmButton: true,
            timer: 5000,
          })
        }
        if (response.data.code === 0) {
          setBtnLock(false)

          Swal.fire({
            position: "center",
            icon: "error",
            title: response.data.data.message,
            showConfirmButton: true,
            timer: 5000,
          })
        }
        document.getElementById("auction-click").click()
      } else {
        setBtnLock(false)
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Auction has been updated",
          showConfirmButton: true,
          timer: 5000,
        })
      }
      document.getElementById("auction-click").click()
    }
  }

  useEffect(() => {
    if (auctionCount === 0) {
      getAuction()

      setAuctionCount(1)
    }
  }, [auctionCount, editAuction, editAuctionItem, items, auctionsImageData]) // eslint-disable-line react-hooks/exhaustive-deps

  //upcoming date change

  const getAuction = async () => {
    debugger
    try {
      setBtnLock(true)
      const response = await auctionService.getItems(auctionId)
      if (response.data.code === 1) {
        setBtnLock(false)
        setItems(response.data.data.auctionItems)
        setEditAuction(response.data.data.auctions[0])
        if (response.data.data.auctions[0].totalBids) {
          document.querySelector(".card_customs_pointer").style.pointerEvents = "none"
          document.querySelector(".input_disabled_date").style.pointerEvents = "none"
          document.querySelectorAll(".input_disabled").forEach((elem) => (elem.disabled = true))
        }
        setStartDate(new Date(response.data.data.auctions[0].startDate))
        setEndDate(new Date(response.data.data.auctions[0].endDate))
        setAuctionsImageData(response.data.data.auctions[0].auctionPic)
        setLoader(false)
      }
    } catch (error) {
      setBtnLock(false)
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.data.message,
        showConfirmButton: true,
        timer: 5000,
      })
    }
  }

  // Add Car Submit
  const [auctionItem, setAuctionItem] = useState({
    make: "",
    model: "",
    mileage: "",
    auctionItemPic: itemsImageData,
    auctionId: auctionId,
    createdBy: JSON.parse(localStorage.getItem("carvalueuser")),
  })

  const [emptyValidationitem, setEmptyValidationItem] = useState({
    makeEmpty: false,
    modelEmpty: false,
    mileageEmpty: false,
    imageEmpty: false,
  })
  useEffect(() => {}, [emptyValidationitem, auctionItem, items])
  const itemSubmit = async (e) => {
    e.preventDefault()
    let validCount = 0
    const c = { ...emptyValidationitem }
    if (itemPicture === null) {
      c.imageEmpty = true
      validCount++
    } else {
      c.imageEmpty = false
    }

    if (auctionItem.make === "") {
      c.makeEmpty = true
      validCount++
    } else {
      c.makeEmpty = false
    }

    if (auctionItem.model === "") {
      c.modelEmpty = true
      validCount++
    } else {
      c.modelEmpty = false
    }

    if (auctionItem.mileage === "") {
      c.mileageEmpty = true
      validCount++
    } else {
      c.mileageEmpty = false
    }
    setEmptyValidationItem(c)

    if (validCount > 0) {
      return
    }
    setBtnLock(true)

    const response = await auctionService.Add(auctionItem)

    if (response.data.code === 1) {
      debugger
      const formData = new FormData()
      formData.append("profilePics", itemPicture)
      const itemResponse = await auctionService.uploadImageItem(response.data.data.auctionItemsId, formData)
      if (itemResponse.data.code === 1) {
        const getItemsResponse = await auctionService.getItems(auctionId)
        setItems(getItemsResponse.data.data.auctionItems)
        const c = { ...auctionItem }
        c.make = ""
        c.model = ""
        c.mileage = ""
        c.auctionItemPic = ""
        setAuctionItem(c)
        deleteAuctionItem()
        setBtnLock(false)
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Car has been saved",
          showConfirmButton: true,
          timer: 5000,
        })
      }
      if (response.data.Code === 0) {
        setBtnLock(false)
        Swal.fire({
          position: "center",
          icon: "error",
          title: response.data.Message,
          showConfirmButton: true,
          timer: 5000,
        })
      }

      document.getElementById("btn-click").click()
    }
    if (response.data.Code === 0) {
      setBtnLock(false)
      Swal.fire({
        position: "center",
        icon: "error",
        title: response.data.Message,
        showConfirmButton: true,
        timer: 5000,
      })
    }
  }

  useEffect(() => {
    if (auctionCount === 0) {
      getAuctionItems()
      setAuctionCount(1)
    }
  }, [auctionCount, editAuctionItem, editAuction])

  const getAuctionItems = async (id, image) => {
    debugger
    const responseitems = await auctionService.getItems(auctionId)
    console.log(responseitems)
    let myItem = responseitems.data.data.auctionItems.filter((element) => {
      if (element.auctionItemsId === Number(id)) {
        return responseitems.data.data.auctionItems
      }
    })
    setEditAuctionItem(myItem)
    setEditItemsImageData(image)
  }
  const deleteAuctionItem = () => {
    setItemPicture(null)
    setItemsImageData(null)
  }

  /// Edit Car Submit
  const itemEdit = async (e) => {
    e.preventDefault()
    let validCount = 0
    debugger
    const c = { ...emptyValidationitem }

    if (editAuctionItem[0].make === "") {
      c.makeEmpty = true
      validCount++
    } else {
      c.makeEmpty = false
    }

    if (editAuctionItem[0].model === "") {
      c.modelEmpty = true
      validCount++
    } else {
      c.modelEmpty = false
    }

    if (editAuctionItem[0].mileage === "") {
      c.mileageEmpty = true
      validCount++
    } else {
      c.mileageEmpty = false
    }
    setEmptyValidationItem(c)

    if (validCount > 0) {
      return
    }

    setBtnLock(true)
    const finalEditItem = {}
    debugger
    finalEditItem.auctionId = editAuctionItem[0].auctionId
    finalEditItem.auctionItemsId = editAuctionItem[0].auctionItemsId
    finalEditItem.make = editAuctionItem[0].make
    finalEditItem.model = editAuctionItem[0].model
    finalEditItem.mileage = editAuctionItem[0].mileage
    finalEditItem.auctionItemPic = editItemsImageData
    finalEditItem.updatedBy = JSON.parse(localStorage.getItem("carvalueuser"))

    const response = await auctionService.updateItem(finalEditItem)
    if (!(editItemPicture === null)) {
      debugger
      const formData = new FormData()
      formData.append("profilepics", editItemPicture)
      const imageResponse = await auctionService.uploadImageItem(response.data.data.auctionItemsId, formData)
      if (imageResponse.data.code === 1) {
        const getItemsResponse = await auctionService.getItems(auctionId)
        setItems(getItemsResponse.data.data.auctionItems)
        setBtnLock(false)
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Vahicle has been Updated",
          showConfirmButton: true,
          timer: 5000,
        })
        document.getElementById("edit-auction-car-btn").click()
      }
      if (response.data.Code === 0) {
        setBtnLock(false)
        history.push("/AddNewAuctions")
        Swal.fire({
          position: "center",
          icon: "error",
          title: response.data.Message,
          showConfirmButton: true,
          timer: 5000,
        })
      }
    } else {
      document.getElementById("edit-auction-car-btn").click()
      setBtnLock(false)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Vahicle has been saved",
        showConfirmButton: true,
        timer: 5000,
      })
    }
  }
  //State
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
      cell: (row) => <img style={{ width: "25px" }} src={row.auctionItemPic ? row.auctionItemPic : "/img/images.png"} alt="profile" />,
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
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="tableactions">
          <button
            onClick={() => getAuctionItems(row.auctionItemsId, row.auctionItemPic)}
            type="button"
            className="auction-edit-btn"
            data-toggle="modal"
            data-target="#edit-car-btn"
          >
            <img alt="table-action" className="tableactions_image" src="./img/Edit.svg" />
          </button>
          <button type="button" data-toggle="modal" class="tableactions_action">
            <img
              alt="table-action"
              class="tableactions_image"
              src="./img/Delete.svg"
              onClick={() => deleteItem(row.auctionItemsId, items, itemServiceDelete, "Vehicle", setLoader, "itemEdit")}
            />
          </button>
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

    const title = "Auctions Vahicles"
    const headers = [["Make Brand", "Model", "mileage"]]

    const pdfData = items.map((elt) => {
      return [elt.make, elt.model, elt.mileage]
    })

    let content = {
      startY: 50,
      head: headers,
      body: pdfData,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save("Auction Vahicles.pdf")
  }

  ///import file btn
  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }

  const handleOnFileLoad = (data) => {
    debugger
    const cars = []
    for (let i = 1; i < data.length; i++) {
      let newObject = {
        make: "",
        model: "",
        mileage: "",
      }

      if (data[i].data[0] !== "") {
        for (let y = 0; y < data[0].data.length; y++) {
          if (data[0].data[y].trim().toLowerCase() === "make") {
            newObject.make = data[i].data[y]
          }
          if (data[0].data[y].trim().toLowerCase() === "model") {
            newObject.model = data[i].data[y]
          }
          if (data[0].data[y].trim().toLowerCase() === "mileage") {
            newObject.mileage = data[i].data[y]
          }
        }

        setItems((oldArray) => [...oldArray, newObject])
        cars.push(newObject)
      }
    }
    postImportFileItem(cars)
  }

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  const handleOnRemoveFile = (data) => {
    console.log("---------------------------")
    console.log(data)
    console.log("---------------------------")
  }

  const handleRemoveFile = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e)
    }
  }

  const showNotPublishedModal = () => {}

  const postImportFileItem = async (items) => {
    debugger
    const finalImportFile = []

    items.forEach((element) => {
      let newObject = {
        make: "",
        model: "",
        mileage: "",
        auctionItemPic: "",
        auctionId: auctionId,
        createdBy: JSON.parse(localStorage.getItem("carvalueuser")),
      }
      newObject.make = element.make
      newObject.model = element.model
      newObject.mileage = element.mileage
      finalImportFile.push(newObject)
    })
    const response = await auctionService.postImportFileItem(finalImportFile)
    setItems(response.data.data)
    const responseitems = await auctionService.getItems(auctionId)
    setItems(responseitems.data.data.auctionItems)
    console.log(response)
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
                            <div className="edit-icon-card">
                              <button type="button" className="auction-edit-btn" data-toggle="modal" data-target="#edit-auction">
                                <img src="./img/profile_edit_profile.svg" alt="edit-icon" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <img
                            style={{ width: "60%", height: "166px", borderRadius: "15px" }}
                            className="auction-image"
                            alt="event_image"
                            src={editAuction.auctionPic}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Auction Name</h3>
                          <h4 className="view-profile-user-name">{editAuction.auctionName}</h4>
                        </div>
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Auction Start Date</h3>
                          <h4 className="view-profile-user-name">{moment(editAuction.startDate).format("L")}</h4>
                        </div>

                        <div className="col-md-4">
                          <div className="auction-pad-bottom">
                            <h3 className="view-profile-name">Auction End Date</h3>
                            <h4 className="view-profile-user-name">{moment(editAuction.endDate).format("L")}</h4>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Auction Fee</h3>
                          <h4 className="view-profile-user-name">{editAuction.auctionFee}</h4>
                        </div>
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Base Fee</h3>
                          <h4 className="view-profile-user-name">{editAuction.basePrice}</h4>
                        </div>
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Total Bids</h3>
                          <h4 className="view-profile-user-name">{editAuction.totalBids}</h4>
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
              <div className="card_custom card_customs_pointer">
                <div className="row">
                  <div className="col-lg-8">
                    <h5 className="custom-card-heading">Vehicle Information</h5>
                  </div>
                  <div className="col-lg-4">
                    <div className="import-options-edit">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <CSVReader
                          ref={buttonRef}
                          onFileLoad={handleOnFileLoad}
                          onError={handleOnError}
                          noClick
                          noDrag
                          onRemoveFile={handleOnRemoveFile}
                        >
                          {({ file }) => (
                            <button
                              className="btn_primary_import import-btn import_file_Btn"
                              type="button"
                              onClick={handleOpenDialog}
                              style={{
                                borderRadius: 0,
                                marginLeft: 0,
                                marginRight: 0,
                                paddingLeft: 0,
                                paddingRight: 0,
                              }}
                            >
                              Import File
                            </button>
                          )}
                        </CSVReader>
                      </div>
                      <button type="button" className="auction-edit-btn" data-toggle="modal" data-target="#Add-car-btn">
                        <div className="btn_primary" style={{ marginTop: "-6px" }}>
                          Add Car
                        </div>
                      </button>
                    </div>
                  </div>
                </div>{" "}
                <div className="datatableheading">Export to:</div>
                <div>
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => exportPDF()}>
                    PDF
                  </button>
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(items, columnNames, "Auctions Items")}>
                    CSV
                  </button>
                </div>
                <input className="tablesearchbox" type="text" placeholder="Search" aria-label="Search Input" />
                {loader ? Loader : <DataTable title="" columns={columns} data={items} pagination />}
              </div>
            </div>
          </div>
        </div>
      </main>

      <div
        className="modal fade edit-auction-padding"
        id="edit-auction"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <main>
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 column_margin">
                  <div className="card_top-bottom">
                    <form className="myform" onSubmit={handleSubmit}>
                      <div className="form-row">
                        <div className="form-group col-md-12 form-group--uploadimage">
                          <h5 className="image-top-headline">Edit Auction Details</h5>
                          <div className="file-upload position-relative">
                            <div className="imagecontainer">
                              <label for="upload-image-auction" className="upload-image-label">
                                <div className="file-pic">
                                  <h5 className="upload-image-title">Upload Image</h5>

                                  <img src={auctionsImageData} id="image-icon" alt="upload_image" />
                                </div>
                              </label>
                              <input
                                onChange={auctionImagesPreview}
                                id="upload-image"
                                name="upload-image"
                                hidden
                                type="file"
                                accept=".png, .jpg, .jpeg"
                                className="input_disabled"
                              />
                              {emptyValidation.imageEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Image is required </p> : ""}
                              <div style={{ position: "relative" }}>
                                <label for="upload-image">
                                  {" "}
                                  <img src="/img/edit_pic.svg" alt="" className="edit_img" />
                                </label>
                              </div>
                            </div>
                            <input id="upload-image" name="upload-image" hidden type="file" accept=".png, .jpg, .jpeg" />
                          </div>
                        </div>

                        <div className="form-group col-md-4 ">
                          <div className="name">
                            <label htmlfor="username">Auction Name</label>
                            <input
                              type="text"
                              name="username"
                              className="form_control input_disabled"
                              placeholder="Enter Name"
                              value={editAuction.auctionName}
                              onChange={(e) => {
                                debugger
                                const c = { ...editAuction }
                                c.auctionName = e.target.value
                                setEditAuction(c)
                              }}
                            />
                            {emptyValidation.auctionNameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Auction Name is required </p> : ""}
                          </div>
                        </div>
                        <div className="form-group col-md-4 ">
                          <div className="email-container position-relative">
                            <label htmlfor="uname" className="w-100 email-label">
                              Auction Start Date
                            </label>
                            <div>
                              <DatePicker
                                selected={startDate}
                                minDate={moment().toDate()}
                                className="form_control input_disabled_date"
                                onChange={(date) => {
                                  debugger
                                  let startDateFlag = moment(date).format("MM-DD-YY")
                                  let dateFlag = moment(new Date()).format("MM-DD-YY")
                                  if (startDateFlag === dateFlag) {
                                    const c = { ...editAuction }
                                    c.auctionStatusId = AuctionStatus.Open
                                    setEditAuction(c)
                                  } else {
                                    const c = { ...editAuction }
                                    c.auctionStatusId = AuctionStatus.Upcoming
                                    setEditAuction(c)
                                  }
                                  setStartDate(date)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-md-4">
                          <div className="phone-container position-relative">
                            <label htmlfor="tel" className="number-label">
                              Auction End Date
                            </label>
                            <DatePicker
                              selected={endDate}
                              minDate={moment().toDate()}
                              placeholder="Start"
                              className="form_control"
                              onChange={(date) => setEndDate(date)}
                            />
                            {emptyValidation.startDateEmpty !== 0 ? (
                              <p style={{ marginTop: "5px", color: "red" }}>{emptyValidation.startDateEmpty} </p>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div className="form-group col-md-4 ">
                          <div className="password-container position-relative">
                            <label htmlfor="pwd" className="100">
                              Entry Fee
                            </label>
                            <div>
                              <input
                                type="number"
                                name="pwd"
                                className="form_control input_disabled"
                                placeholder="Enter Fee"
                                onChange={(e) => {
                                  const c = { ...editAuction }
                                  c.auctionFee = e.target.value
                                  setEditAuction(c)
                                }}
                                value={editAuction.auctionFee}
                              />
                            </div>
                            {emptyValidation.auctionFeeEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Entry fee is required </p> : ""}
                          </div>
                        </div>
                        <div className="form-group col-md-4 ">
                          <div className="password-container position-relative">
                            <label htmlfor="pwd" className="100">
                              Base Fee
                            </label>
                            <div>
                              <input
                                type="number"
                                name="pwd"
                                className="form_control input_disabled"
                                placeholder="Enter Base Fee"
                                onChange={(e) => {
                                  const c = { ...editAuction }
                                  c.basePrice = e.target.value
                                  setEditAuction(c)
                                }}
                                value={editAuction.basePrice}
                              />
                            </div>
                            {emptyValidation.basePriceEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Base price is required </p> : ""}
                          </div>
                        </div>
                        <div className="col-md-12 ">
                          <div className="formbtncontainer">
                            <button type="submit" className="btn_primary submitbtn">
                              Update {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                            </button>
                            <button type="button" className="popup-btn" data-dismiss="modal" id="auction-click">
                              <Link className="btn_primary_outline cancelbtn">Cancel</Link>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Edit auction End  */}

      {/* Add Car start */}
      <div
        className="modal fade edit-auction-padding"
        id="Add-car-btn"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <main>
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 column_margin">
                  <div className="card_top-bottom">
                    <form className="myform" onSubmit={itemSubmit} id="reset-form">
                      <div className="form-row">
                        <div className="form-group col-md-12 form-group--uploadimage">
                          <h5 className="image-top-headline">Add Car Details</h5>
                          <div className="file-upload position-relative">
                            <div className="imagecontainer">
                              <label for="upload-image-item" className="upload-image-label">
                                <div className="file-pic">
                                  <h5 className="upload-image-title">Upload Image</h5>
                                  <img src="/img/icon_upload_add_load.svg" alt="upload_image" />
                                  {itemsImageData ? <img src={itemsImageData} id="image-icon" className="addNewItem-image" alt="upload_image" /> : ""}
                                </div>
                              </label>
                              <input
                                onChange={itemsImagesPreview}
                                id="upload-image-item"
                                name="upload-image"
                                hidden
                                type="file"
                                accept=".png, .jpg, .jpeg"
                              />
                              {emptyValidationitem.imageEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Image is required </p> : ""}
                            </div>
                            <input id="upload-image" name="upload-image" hidden type="file" accept=".png, .jpg, .jpeg" />
                          </div>
                        </div>

                        <div className="form-group col-md-4">
                          <div className="name">
                            <label htmlfor="username">Make Brand</label>
                            <input
                              type="text"
                              name="username"
                              className="form_control"
                              placeholder="Enter Car Brand"
                              onChange={(e) => {
                                const c = { ...auctionItem }
                                c.make = e.target.value
                                setAuctionItem(c)
                              }}
                              value={auctionItem.make}
                            />
                          </div>
                          {emptyValidationitem.makeEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Brand name is required </p> : ""}
                        </div>
                        <div className="form-group col-md-4">
                          <div className="email-container position-relative">
                            <label htmlfor="uname" className="w-100 email-label">
                              Model Year
                            </label>
                            <div>
                              <div>
                                <input
                                  type="text"
                                  name="pwd"
                                  className="form_control"
                                  id="password"
                                  placeholder="Enter Modal Year"
                                  onChange={(e) => {
                                    const c = { ...auctionItem }
                                    c.model = e.target.value
                                    setAuctionItem(c)
                                  }}
                                  value={auctionItem.model}
                                />
                              </div>
                              {emptyValidationitem.makeEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Modal year is required </p> : ""}
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-md-4">
                          <div className="phone-container position-relative">
                            <label htmlfor="tel" className="number-label">
                              Mileage
                            </label>
                            <div>
                              <input
                                type="number"
                                name="pwd"
                                className="form_control"
                                id="password"
                                placeholder="Enter Mileage"
                                onChange={(e) => {
                                  const c = { ...auctionItem }
                                  c.mileage = e.target.value
                                  setAuctionItem(c)
                                }}
                                value={auctionItem.mileage}
                              />
                            </div>
                            {emptyValidationitem.mileageEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Mileage is required </p> : ""}
                          </div>
                        </div>
                        <div className="form-group-auction col-md-12 ">
                          <div className="formbtncontainer">
                            <button type="submit" disabled={btnLock} className="btn_primary submitbtn">
                              Save {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                            </button>
                            <button type="button" className="popup-btn" data-dismiss="modal" id="btn-click">
                              <Link to="/ManageAuctions" className="btn_primary_outline cancelbtn">
                                Cancel
                              </Link>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* Add Car End */}

      {/* Edit car start popup */}
      <div
        className="modal fade edit-auction-padding"
        id="edit-car-btn"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <main>
            <div className="container-fluid">
              <div className="row">
                <div className="col-12 column_margin">
                  <div className="card_top-bottom">
                    <form className="myform" onSubmit={itemEdit}>
                      <div className="form-row">
                        <div className="form-group col-md-12 form-group--uploadimage">
                          <h5 className="image-top-headline">Edit Car Details</h5>
                          <div className="file-upload position-relative">
                            <div className="imagecontainer">
                              <label for="upload-image-edit" className="upload-image-label">
                                <div className="file-pic">
                                  <h5 className="upload-image-title">Upload Image</h5>
                                  {editItemsImageData ? <img src={editItemsImageData} id="image-icon" alt="upload_image" /> : ""}
                                </div>
                              </label>
                              <input
                                onChange={EdititemsImagesPreview}
                                id="upload-image2"
                                name="upload-image"
                                hidden
                                type="file"
                                accept=".png, .jpg, .jpeg"
                              />
                              <div style={{ position: "relative" }}>
                                <label for="upload-image2">
                                  {" "}
                                  <img src="/img/edit_pic.svg" alt="" className="edit_img" />
                                </label>
                              </div>
                            </div>
                            <input id="upload-image" name="upload-image" hidden type="file" accept=".png, .jpg, .jpeg" />
                          </div>
                        </div>

                        <div className="form-group col-md-4">
                          <div className="name">
                            <label htmlfor="username">Make Brand</label>
                            <input
                              type="text"
                              name="username"
                              className="form_control"
                              placeholder="Enter Car Brand"
                              onChange={(e) => {
                                const c = [...editAuctionItem]
                                c[0].make = e.target.value
                                setEditAuctionItem(c)
                              }}
                              value={editAuctionItem[0]?.make}
                            />
                          </div>
                        </div>
                        <div className="form-group col-md-4">
                          <div className="email-container position-relative">
                            <label htmlfor="uname" className="w-100 email-label">
                              Modal Year
                            </label>
                            <div>
                              <div>
                                <input
                                  type="text"
                                  name="pwd"
                                  className="form_control"
                                  id="password"
                                  placeholder="Enter Modal Year"
                                  onChange={(e) => {
                                    const c = [...editAuctionItem]
                                    c[0].model = e.target.value
                                    setEditAuctionItem(c)
                                  }}
                                  value={editAuctionItem[0]?.model}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-md-4">
                          <div className="phone-container position-relative">
                            <label htmlfor="tel" className="number-label">
                              Mileage
                            </label>
                            <div>
                              <input
                                type="number"
                                name="pwd"
                                className="form_control"
                                id="password"
                                placeholder="Enter MileAge"
                                onChange={(e) => {
                                  const c = [...editAuctionItem]
                                  c[0].mileage = e.target.value
                                  setEditAuctionItem(c)
                                }}
                                value={editAuctionItem[0]?.mileage}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group-auction col-md-12 ">
                          <div className="formbtncontainer">
                            <button type="submit" disabled={btnLock} className="btn_primary submitbtn">
                              Update {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                            </button>
                            <button type="button" className="popup-btn" data-dismiss="modal">
                              <Link to="/ManageUsers" className="btn_primary_outline cancelbtn" id="edit-auction-car-btn">
                                Cancel
                              </Link>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* Edit car End */}
    </div>
  )
}
export default EditAuctions
