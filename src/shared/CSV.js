const downloadCSV = (array, columnNames, fileName) => {
  debugger
  const link = document.createElement("a")
  let csv = convertArrayOfObjectsToCSV(array, columnNames)
  if (csv == null) return
  const filename = fileName + ".csv"
  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`
  }
  link.setAttribute("href", encodeURI(csv))
  link.setAttribute("download", filename)
  link.click()
}

const convertArrayOfObjectsToCSV = (array, columnNames) => {
  let result

  const columnDelimiter = ","
  const lineDelimiter = "\n"
  const keys = Object.keys(columnNames[0])

  result = ""
  result += keys.join(columnDelimiter)
  result += lineDelimiter

  array.forEach((item) => {
    let ctr = 0
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter

      result += item[key]

      ctr++
    })
    result += lineDelimiter
  })

  return result
}

export default downloadCSV
