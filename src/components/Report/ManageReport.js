import DashBoardService from "../../services/DashBoardService"
import { useEffect, useState } from "react"
import Loader from "../../shared/Loader"

import { Line } from "react-chartjs-2"
import "jspdf-autotable"
import jsPDF from "jspdf"

function Report() {
  const [dashboard] = useState({})

  const [data, setData] = useState([])
  const [loader, setLoader] = useState(true)
  const [eventCount, setEventCount] = useState(0)
  const [dashboardLabels, setDashboardLabels] = useState([])
  const [dashboardchartData, setDashBoardChartData] = useState([])

  const dashboardService = new DashBoardService()
  const columnNames = [
    {
      Month: "",
      Price: 0,
    },
  ]

  const dashboardChart = {
    labels: dashboardLabels,
    datasets: [
      {
        label: "Monthly Reports ",
        data: dashboardchartData,
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
    if (eventCount === 0) {
      getDashBoard()
      setEventCount(1)
    }
  }, [dashboard, eventCount]) // eslint-disable-line react-hooks/exhaustive-deps

  const getDashBoard = async () => {
    const response = await dashboardService.get()
    setData(response.data.Data)
    let labels = response.data.Data.MonthlyReports.map((item) => {
      return item.Month
    })
    let dashboardChartData = response.data.Data.MonthlyReports.map((item) => {
      return item.Price
    })

    setDashBoardChartData(dashboardChartData)
    setDashboardLabels(labels)
    setLoader(false)
  }

  //Functions

  const exportPDF = () => {
    const unit = "pt"
    const size = "A4" // Use A1, A2, A3 or A4
    const orientation = "portrait" // portrait or landscape

    const marginLeft = 40
    const doc = new jsPDF(orientation, unit, size)

    doc.setFontSize(15)

    const title = "Report"
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

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <h1 className="headertopbar_title">Generate Report</h1>
                <button onClick={(e) => exportPDF()} className="headertopbar_btn btn_primary">
                  Generate Report
                </button>
              </div>
            </div>
            {loader ? (
              Loader
            ) : (
              <div className="col-12 column_margin">
                <div className="dasboardstatscards">
                  <div className="dasboardstatscards_column">
                    <div className="dasboardstatscards_card">
                      <div className="dasboardstatscards_left">
                        <h5 className="dasboardstatscards_subtitle">Total Users</h5>
                        <h3 className="dasboardstatscards_title">{data.ActiveUsers}</h3>
                      </div>

                      <div className="dasboardstatscards_right">
                        <img className="dasboardstatscards_image" src="./img/Restaurant_Owner.svg" alt="stat-img" />
                      </div>
                    </div>
                  </div>
                  <div className="dasboardstatscards_column">
                    <div className="dasboardstatscards_card">
                      <div className="dasboardstatscards_left">
                        <h5 className="dasboardstatscards_subtitle">Restaurant Owner</h5>
                        <h3 className="dasboardstatscards_title">{data.BusinessUsers}</h3>
                      </div>
                      <div className="dasboardstatscards_right">
                        <img className="dasboardstatscards_image" src="./img/user_stat.svg" alt="stat-img" />
                      </div>
                    </div>
                  </div>
                  <div className="dasboardstatscards_column">
                    <div className="dasboardstatscards_card">
                      <div className="dasboardstatscards_left">
                        <h5 className="dasboardstatscards_subtitle">New Subscription</h5>
                        <h3 className="dasboardstatscards_title">{data.Subscriptions}</h3>
                      </div>
                      <div className="dasboardstatscards_right">
                        <div className="arrow-up"></div>
                        <h4 className="dasboardstatscards_percentage dasboardstatscards_percentage--up">+56%</h4>
                      </div>
                    </div>
                  </div>
                  <div className="dasboardstatscards_column">
                    <div className="dasboardstatscards_card">
                      <div className="dasboardstatscards_left">
                        <h5 className="dasboardstatscards_subtitle">Cancellations</h5>
                        <h3 className="dasboardstatscards_title">{data.Cancellations}</h3>
                      </div>
                      <div className="dasboardstatscards_right">
                        <div className="arrow-down"></div>
                        <h4 className="dasboardstatscards_percentage dasboardstatscards_percentage--down">+56%</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="col-12 column_margin">
              <div className="card_custom">
                <h2 className="card_custom_title">Monthly Reports</h2>

                {loader ? (
                  Loader
                ) : (
                  <>
                    <div className="chart-container chart">
                      <Line height="100%" data={dashboardChart} options={options} />
                    </div>
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
export default Report
