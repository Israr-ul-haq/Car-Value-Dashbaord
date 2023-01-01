import React, { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import "react-datepicker/dist/react-datepicker.css"
import DataTable from "react-data-table-component"
import downloadCSV from "../../shared/CSV"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "jspdf-autotable"
import jsPDF from "jspdf"
import moment from "moment"
import AuctionService from "../../Services/AuctionService"
import Loader from "../../shared/Loader"
import { CSVReader } from "react-papaparse"
import deleteItem from "../../shared/DeleteItem"
import ItemServiceDelete from "../../Services/ItemServiceDelete"
import { AuctionStatus } from "../constants/AuctionStatus"

function AddNewAuctions() {
  const [btnLock, setBtnLock] = useState(false)
  // SERVICES
  const buttonRef = React.createRef()
  const auctionService = new AuctionService()
  const itemServiceDelete = new ItemServiceDelete()
  const history = useHistory()
  const [importDisable, setImportDisable] = useState(0)

  const [storage, setStorage] = useState()
  const [items, setItems] = useState([])
  const [auctionId, setAuctionId] = useState()
  const [imgData, setImgData] = useState("/img/icon_upload_add_load.svg")
  const [image, setImage] = useState(false)
  const [loader, setLoader] = useState(false)
  const [editAuctionItem, setEditAuctionItem] = useState({})
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

  const [picture, setPicture] = useState(null)
  const [auction, setAuction] = useState({
    auctionName: "",
    startDate: new Date(),
    endDate: new Date(),
    auctionFee: "",
    basePrice: "",
    auctionPicName: "",
    createdBy: JSON.parse(localStorage.getItem("carvalueuser")),
    createdOn: "2021-10-20T15:11:03.753Z",
    auctionStatusId: 1,
  })
  const imagesPreview = (e) => {
    debugger
    if (e.target.files[0]) {
      setPicture(e.target.files[0])
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setImgData(reader.result)
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
    imageEmpty: false,
    auctionStatusIdEmpty: false,
  })

  useEffect(() => {}, [emptyValidation, auction])

  const handleSubmit = async (e) => {
    debugger
    e.preventDefault()
    let validCount = 0
    const c = { ...emptyValidation }
    if (picture === null) {
      c.imageEmpty = true
      validCount++
    } else {
      c.imageEmpty = false
    }

    if (auction.auctionName === "") {
      c.auctionNameEmpty = true
      validCount++
    } else {
      c.auctionNameEmpty = false
    }

    if (auction.auctionFee === "") {
      c.auctionFeeEmpty = true
      validCount++
    } else {
      c.auctionFeeEmpty = false
    }

    if (auction.basePrice === "") {
      c.basePriceEmpty = true
      validCount++
    } else {
      c.basePriceEmpty = false
    }
    if (auction.startDate === "") {
      c.startDateEmpty = true
      validCount++
    } else {
      c.startDateEmpty = false
    }
    if (auction.endDate === "") {
      c.endDateEmpty = true
      validCount++
    } else {
      c.endDateEmpty = false
    }

    // let startDateFlag = moment(auction.startDate).format("MM-DD-YYYY")
    // let endDateFlag = moment(auction.endDate).format("MM-DD-YYYY")
    // if (endDateFlag < startDateFlag) {
    //   c.startDateEmpty = "End date must be greater than start date"
    //   validCount++
    // } else {
    //   c.startDateEmpty = ""
    // }
    debugger
    if (auction.endDate.getTime() < auction.startDate.getTime()) {
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

    setStorage(JSON.parse(localStorage.getItem("carvalueuser")))
    const response = await auctionService.save(auction)
    debugger
    setAuctionId(response.data.data.auctionId)

    const copy = { ...auctionItem }
    copy.auctionId = response.data.data.auctionId
    setAuctionItem(copy)
    if (response.data.code === 1) {
      setAuctionId(response.data.data.auctionId)
      setBtnLock(false)
      const formData = new FormData()
      formData.append("ProfilePics", picture)
      const imageResponse = await auctionService.uploadImage(response.data.data.auctionId, formData)
      if (response.data.data.auctionId) {
        setAuctionId(response.data.data.auctionId)
        document.querySelector(".auction_cardCustom").style.pointerEvents = "auto"
        document.querySelector(".itemsDataTable").style.opacity = 1
        document.querySelector(".import-options").style.opacity = 1
      }
      if (imageResponse.data.code === 1) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Auction has been saved",
          showConfirmButton: true,
          timer: 5000,
        })
      }

      if (imageResponse.data.code === 0) {
        setBtnLock(false)

        Swal.fire({
          position: "center",
          icon: "error",
          title: imageResponse.data.Message,
          showConfirmButton: true,
          timer: 5000,
        })
      }
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
  }
  const [pictureitem, setPictureitem] = useState(null)
  const [imgDataItem, setImgDataItem] = useState()
  const imagesPreviewitems = (e) => {
    debugger
    if (e.target.files[0]) {
      setPictureitem(e.target.files[0])
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setImgDataItem(reader.result)
        setImage(reader.result)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  ///Auction item form
  const [auctionItem, setAuctionItem] = useState({
    make: "",
    model: "",
    mileage: "",
    auctionItemPic: "",
    auctionId: 0,
    createdBy: JSON.parse(localStorage.getItem("carvalueuser")),
  })
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

  const [emptyValidationitem, setEmptyValidationItem] = useState({
    makeEmpty: false,
    modelEmpty: false,
    mileageEmpty: false,
    imageEmpty: false,
  })
  useEffect(() => {}, [emptyValidationitem, auctionItem, items])

  const deleteAuctionItem = () => {
    setImgDataItem(null)
    setPictureitem(null)
  }
  const itemSubmit = async (e) => {
    e.preventDefault()
    let validCount = 0
    const c = { ...emptyValidationitem }

    if (pictureitem === null) {
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
      formData.append("profilePics", pictureitem)
      const itemResponse = await auctionService.uploadImageItem(response.data.data.auctionItemsId, formData)
      if (itemResponse.data.code === 1) {
        const c = { ...auctionItem }
        c.make = ""
        c.model = ""
        c.mileage = ""

        setAuctionItem(c)
        deleteAuctionItem()
        const responseitems = await auctionService.getItems(auctionId)
        setItems(responseitems.data.data.auctionItems)
        document.getElementById("btn-click").click()
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
        history.push("/AddNewAuctions")
        Swal.fire({
          position: "center",
          icon: "error",
          title: response.data.Message,
          showConfirmButton: true,
          timer: 5000,
        })
      }
    }
    if (response.data.code === 0) {
      setBtnLock(false)
      history.push("/AddNewAuctions")
      Swal.fire({
        position: "center",
        icon: "error",
        title: response.data.data.message,
        showConfirmButton: true,
        timer: 5000,
      })
    }
  }

  const [data, setData] = useState([])

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
      // newObject.auctionId = element.auctionId
      finalImportFile.push(newObject)
    })
    const response = await auctionService.postImportFileItem(finalImportFile)
    setItems(response.data.data)
    const responseitems = await auctionService.getItems(auctionId)
    setItems(responseitems.data.data.auctionItems)
    console.log(response)
  }

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
  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <Link to="/ManageAuctions" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.svg" /> Add Auction
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_top-bottom">
                <form className="myform" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group col-md-12 form-group--uploadimage">
                      <h5 className="image-top-headline">Add Auction Details</h5>
                      <div className="file-upload position-relative">
                        <div className="imagecontainer">
                          <label for="upload-image" className="upload-image-label">
                            <div className="file-pic">
                              <h5 className="upload-image-title">Upload Image</h5>

                              <img src={imgData} id="image-icon" alt="upload_image" />
                            </div>
                          </label>
                        </div>
                        <input onChange={imagesPreview} id="upload-image" name="upload-image" hidden type="file" accept=".png, .jpg, .jpeg" />
                        {emptyValidation.imageEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Image is required </p> : ""}
                      </div>
                    </div>

                    <div className="form-group col-md-4">
                      <div className="name">
                        <label htmlfor="username">Auction Name</label>
                        <input
                          type="text"
                          name="username"
                          className="form_control"
                          placeholder="Enter Name"
                          onChange={(e) => {
                            const c = { ...auction }
                            c.auctionName = e.target.value
                            setAuction(c)
                          }}
                          value={auction.auctionName}
                        />
                      </div>
                      {emptyValidation.auctionNameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Auction Name is required </p> : ""}
                    </div>
                    <div className="form-group col-md-4">
                      <div className="email-container position-relative">
                        <label htmlfor="uname" className="w-100 email-label">
                          Auction Start Date
                        </label>
                        <div>
                          <DatePicker
                            selected={auction.startDate}
                            minDate={moment().toDate()}
                            placeholder="Start"
                            className="form_control"
                            id="email-address"
                            onChange={(date) => {
                              debugger
                              const c = { ...auction }
                              c.startDate = date
                              let startDateFlag = moment(date).format("MM-DD-YY")
                              let dateFlag = moment(new Date()).format("MM-DD-YY")
                              if (startDateFlag === dateFlag) {
                                c.auctionStatusId = AuctionStatus.Open
                                setAuction(c)
                              } else {
                                c.auctionStatusId = AuctionStatus.Upcoming
                                setAuction(c)
                              }
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
                          selected={auction.endDate}
                          minDate={moment().toDate()}
                          placeholder="Start"
                          className="form_control"
                          id="email-address"
                          onChange={(date) => {
                            debugger
                            const c = { ...auction }
                            c.endDate = date
                            setAuction(c)
                          }}
                        />
                        {emptyValidation.startDateEmpty !== 0 ? (
                          <p style={{ marginTop: "5px", color: "red" }}>{emptyValidation.startDateEmpty} </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          Entry Fee
                        </label>
                        <div>
                          <input
                            type="number"
                            name="pwd"
                            className="form_control"
                            id="password"
                            placeholder="Enter Fee"
                            onChange={(e) => {
                              const c = { ...auction }
                              c.auctionFee = e.target.value
                              setAuction(c)
                            }}
                            value={auction.auctionFee}
                          />
                          {emptyValidation.auctionFeeEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Entry fee is required </p> : ""}
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          Base Fee
                        </label>
                        <div>
                          <input
                            type="number"
                            name="pwd"
                            className="form_control"
                            id="confirm-password"
                            placeholder="Enter Base Fee"
                            onChange={(e) => {
                              const c = { ...auction }
                              c.basePrice = e.target.value
                              setAuction(c)
                            }}
                            value={auction.basePrice}
                          />
                        </div>
                        {emptyValidation.basePriceEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Base price is required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-12">
                      <div className="formbtncontainer formbtntop">
                        <button type="submit" disabled={btnLock} className="btn_primary submitbtn">
                          Save {btnLock ? <div class="btnloader">{Loader}</div> : ""}
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
      <main className="main-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 column_margin">
              <div className="card_custom auction_cardCustom">
                <div className="row">
                  <div className="col-lg-8">
                    <h5 className="custom-card-heading">Vahicle Information</h5>
                  </div>
                  <div className="col-lg-4">
                    <div className="import-options">
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
                <div className="itemsDataTable">
                  <div className="datatableheading">Export to:</div>
                  <div>
                    <button className="btn btn-secondary datatablebuttons" onClick={(e) => exportPDF()}>
                      PDF
                    </button>
                    <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(items, columnNames, "Auctions")}>
                      CSV
                    </button>
                  </div>
                  <input className="tablesearchbox" type="text" placeholder="Search" aria-label="Search Input" />
                  {loader ? Loader : <DataTable title="" columns={columns} data={items} pagination />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="form-group-auction col-md-12 ">
        <div className="formbtncontainer">
          {/* <button type="submit" className="btn_primary submitbtn">
            Update
          </button> */}
          <Link to="/ManageAuctions" className="btn_primary_outline cancelbtn">
            Cancel
          </Link>
        </div>
      </div>

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
                                  {imgDataItem ? <img src={imgDataItem} id="image-icon" className="addNewItem-image" alt="upload_image" /> : ""}
                                </div>
                              </label>
                            </div>
                            <input
                              onChange={imagesPreviewitems}
                              id="upload-image-item"
                              name="upload-image"
                              hidden
                              type="file"
                              accept=".png, .jpg, .jpeg"
                            />
                            {emptyValidationitem.imageEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Image is required </p> : ""}
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
                              Modal Year
                            </label>
                            <div>
                              <div>
                                <input
                                  type="number"
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
                                placeholder="Enter MileAge"
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

export default AddNewAuctions
