import { useEffect, useState } from "react"
import Loader from "../../shared/Loader"
import DashBoardService from "../../Services/DashBoardService"
import { Line } from "react-chartjs-2"
import "jspdf-autotable"
import jsPDF from "jspdf"
import downloadCSV from "../../shared/CSV"
import PerfectScrollbar from "perfect-scrollbar"


function Dashboard() {
  const dashBoardservice = new DashBoardService() 
  //Se
  const [dashboard, setDashBoard] = useState({})
  const [user, setUser] = useState([])
  const [data, setData] = useState([])
  const [dashboardLabels, setDashboardLabels] = useState([])
  const [dataCount, setDataCount] = useState(0)
  const [dashboardchartData, setDashBoardChartData] = useState([])
  const [bidlabels, setBidsLabels] = useState([])
  const [bidsChartData, setBidsChartData] = useState([])
  const [loader, setloader] = useState(true)

  const vahiclesReportChart = {
    labels: dashboardLabels,
    datasets: [
      {
        label: "Total Auctions",
        data: dashboardchartData,
        fill: false,
        backgroundColor: "#131f54",
        borderColor: "#131f5433",
      },
      {
        label: "Total Bids",
        data: bidsChartData,
        fill: false,
        backgroundColor: "#131f54",
        borderColor: "#131f5433",
      },
    ],
  }
  
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }

  useEffect(() => {
    //To initialise:

    const container = document.querySelector("#menuScroll")
    const ps = new PerfectScrollbar(container)
  })

  const exportPDF = () => {
    const unit = "pt"
    const size = "A4" // Use A1, A2, A3 or A4
    const orientation = "portrait" // portrait or landscape

    const marginLeft = 40
    const doc = new jsPDF(orientation, unit, size)

    doc.setFontSize(15)

    const title = "Events"
    const headers = [["Month", "Price"]]
    const pdfData = data.MonthlyReports.map((elt) => {
      return [elt.Month, elt.Price]
    })

    let content = {
      startY: 50,
      head: headers,
      body: pdfData,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save("Monthly Reports.pdf")
  }

  useEffect(() => {
    if(dataCount === 0){
      getDashboard()
      getAuctionStats()
      setDataCount(1) 
      getBiddingStats()
    }
  },[dashboard])// eslint-disable-line react-hooks/exhaustive-deps


  const getDashboard = async () => {
    debugger
    
    const response = await dashBoardservice.get()
    console.log(response)
    setDashBoard(response.data.data[0])
    setloader(false)
  }
  const getAuctionStats = async () => {
    debugger   
    const response = await dashBoardservice.getAuctionStats()
    let labels = response.data.data.map((item) => {
      return item.month
    })
    let dashboardChartData = response.data.data.map((item) => {
      return item.total
    })
    setDashBoardChartData(dashboardChartData)
    setDashboardLabels(labels)
    setloader(false)
  }
  const getBiddingStats = async () => {
    debugger   
    const response = await dashBoardservice.getBiddingStats()
    let bidlabels = response.data.data.map((item) => {
      return item.month
    })
    let bidsChartData = response.data.data.map((item) => {
      return item.total
    })
    setBidsChartData(bidsChartData)
    setBidsLabels(bidlabels)
    setloader(false)
  }


  

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <h1 className="headertopbar_title">Dashboard</h1>
              </div>
            </div>

            <div className="col-12 column_margin">
              <div className="dasboardstatscards">
                <div className="dasboardstatscards_column">
                  <div className="dasboardstatscards_card">
                    <div className="dasboardstatscards_left">
                      {loader ? (
                        Loader
                      ): (
                      <>
                      <h5 className="dasboardstatscards_subtitle">Total Users</h5>
                      <h3 className="dasboardstatscards_title">{dashboard.totalAppUsers}</h3>
                      </>
                      )}
                    </div>

                    <div className="dasboardstatscards_right">
                      <img className="dasboardstatscards_image" src="./img/user (1).svg" alt="stat-img" />
                    </div>
                  </div>
                </div>
                <div className="dasboardstatscards_column">
                  <div className="dasboardstatscards_card">
                    <div className="dasboardstatscards_left">
                    {loader ? (
                        Loader
                      ): (
                      <>
                      <h5 className="dasboardstatscards_subtitle">Total Bids</h5>
                      <h3 className="dasboardstatscards_title">{dashboard.totalBids}</h3>
                      </>
                      )}
                    </div>
                     
                    <div className="dasboardstatscards_right">
                      <img className="dasboardstatscards_image" src="./img/Restaurant Owner.svg" alt="stat-img" />
                    </div>
                  </div>
                </div>
                <div className="dasboardstatscards_column">
                  <div className="dasboardstatscards_card">
                    <div className="dasboardstatscards_left">
                    {loader ? (
                        Loader
                      ): (
                      <>
                      <h5 className="dasboardstatscards_subtitle">Active Auctions</h5>
                      <h3 className="dasboardstatscards_title">{dashboard.totalActiveAuctions}</h3>
                      </>
                      )}
                    </div>
                    <div className="dasboardstatscards_right">
                      <img className="dasboardstatscards_image" src="./img/bid.svg" alt="stat-img" />
                    </div>
                  </div>
                </div>
                <div className="dasboardstatscards_column">
                  <div className="dasboardstatscards_card">
                    <div className="dasboardstatscards_left">
                    {loader ? (
                        Loader
                      ): (
                      <>
                      <h5 className="dasboardstatscards_subtitle">Total Car Auctioned</h5>
                      <h3 className="dasboardstatscards_title">{dashboard.totalCarsAuctioned}</h3>
                      </>
                      )}
                    </div>
                    <div className="dasboardstatscards_right">
                      <img className="dasboardstatscards_image" src="./img/auction.svg" alt="stat-img" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 column_margin">
              <div className="card_custom">
                <h2 className="card_custom_title">Monthly Reports</h2>

                <div className="chart-container chart">
                {loader ? (
                        Loader
                      ) : (
                        <>
                          <Line height="100%" data={vahiclesReportChart} options={options} />
                        </>
                      )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
export default Dashboard
