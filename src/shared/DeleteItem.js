import Swal from "sweetalert2"

const deleteItem = async (id, data, service, title, setLoader, removeId) => {
  Swal.fire({
    title: "Are you sure, you want to delete " + title + "?",
    showCancelButton: true,
    confirmButtonText: `Delete`,
    showCloseButton: true,
    closeButtonHtml: '<img src="./img/Icon material-cancel.png" alt="crossicon" className="popupcrossimage"/>',
    reverseButtons: true,
  }).then(async (result) => {
    debugger
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      setLoader(true)
      let removeIndex = data
        .map((item) => {
          if (removeId === "auctionId") {
            return item.auctionId
          } else if (removeId === "userId") {
            return item.id
          } else if (removeId === "subAdminId") {
            return item.id
          } else if (removeId === "itemEdit") {
            return item.auctionItemsId
          }
        })
        .indexOf(id)
      data.splice(removeIndex, 1)

      const response = await service.delete(id)

      if (response.data.code === 1) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: title + " deleted!",
        })

        setLoader(false)
      }

      if (response.data.Code === 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        })
        setLoader(false)
      }
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info")
      setLoader(false)
    }
  })
}

export default deleteItem
