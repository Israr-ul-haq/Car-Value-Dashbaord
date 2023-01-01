import { Switch, Route, HashRouter } from "react-router-dom"
import PrivateRoute from "./components/Common/PrivateRoute"
import Login from "./components/Account/Login/Login"
import AuthLayout from "./layouts/AuthLayout"
import WebLayout from "./layouts/WebLayout"
import Profile from "./components/Profile/Profile"
import Dashboard from "./components/Dashboard/Dashboard"

import "jquery/dist/jquery.min.js"
//Datatable Modules
import "datatables.net/js/jquery.dataTables.min.js"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import "datatables.net-buttons/js/buttons.colVis"
import "datatables.net-buttons/js/buttons.html5"
import "datatables.net-buttons/js/buttons.flash"
import "datatables.net-buttons/js/buttons.print"
import ManageUsers from "./components/Users/ManageUsers"
import ViewUsersRequest from "./components/UsersRequest/ViewUserRequest"
import ManageUsersRequest from "./components/UsersRequest/ManageUsersRequest"
import AddNewUser from "./components/Users/AddNewUsers"
import EditUser from "./components/Users/EditUser"
import ViewUsers from "./components/Users/ViewUsers"
import ManageSubAdmin from "./components/SubAdmin/ManageSubAdmin"
import AddNewSubAdmin from "./components/SubAdmin/AddNewSubAdmin"
import EditSubAdmin from "./components/SubAdmin/EditSubAdmin"
import ViewSubAdmin from "./components/SubAdmin/ViewSubAdmin"
import ManageAuctions from "./components/Auctions/ManageAuctions"
import AddNewAuctions from "./components/Auctions/AddNewAuctions"
import EditAuction from "./components/Auctions/EditAuction"
import ManagePayments from "./components/Payments/ManagePayments"
import ViewPayments from "./components/Payments/ViewPayments"
import ViewAuctions from "./components/Auctions/ViewAuctionsDetails"
import peopleBids from "./components/Auctions/peopleBids"
import ViewPeopleBid from "./components/Auctions/ViewPeopleBid"

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/account/:path?">
          <AuthLayout>
            <Switch>
              <Route path={"/Account/login"} exact component={Login} />
            </Switch>
          </AuthLayout>
        </Route>
        {/* <Route> */}
        <Route>
          <WebLayout>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute path="/Profile" component={Profile} />
              <PrivateRoute path="/ManageUsersRequest" component={ManageUsersRequest} />
              <PrivateRoute path="/ViewUsersRequest/:id" component={ViewUsersRequest} />
              <PrivateRoute path="/ManageUsers" component={ManageUsers} />
              <PrivateRoute path="/AddNewUsers" component={AddNewUser} />
              <PrivateRoute path="/EditUser/:userId" component={EditUser} />
              <PrivateRoute path="/ViewUsers/:id" component={ViewUsers} />
              <PrivateRoute path="/ManageSubAdmin" component={ManageSubAdmin} />
              <PrivateRoute path="/AddNewSubAdmin" component={AddNewSubAdmin} />
              <PrivateRoute path="/EditSubAdmin/:userId" component={EditSubAdmin} />
              <PrivateRoute path="/ViewSubAdmin/:id" component={ViewSubAdmin} />
              <PrivateRoute path="/ManageAuctions" component={ManageAuctions} />
              <PrivateRoute path="/AddNewAuctions" component={AddNewAuctions} />
              <PrivateRoute path="/EditAuction/:auctionId" component={EditAuction} />
              <PrivateRoute path="/ManagePayments" component={ManagePayments} />
              <PrivateRoute path="/ViewPayments/:auctionId" component={ViewPayments} />
              <PrivateRoute path="/ViewAuctions/:auctionId" component={ViewAuctions} />
              <PrivateRoute path="/peopleBids/:auctionId" component={peopleBids} />
              <PrivateRoute path="/ViewPeopleBid/:createdBy/:auctionId" component={ViewPeopleBid} />
            </Switch>
          </WebLayout>
        </Route>
      </Switch>
    </HashRouter>
  )
}

export default App
