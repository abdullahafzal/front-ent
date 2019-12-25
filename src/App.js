import { STATE_LOGIN, STATE_SIGNUP } from 'components/AuthForm';
import GAListener from 'components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from 'components/Layout';
import AlertPage from 'pages/AlertPage';
import AuthModalPage from 'pages/AuthModalPage';
import AuthPage from 'pages/AuthPage';
import BadgePage from 'pages/BadgePage';
import ButtonGroupPage from 'pages/ButtonGroupPage';
import ButtonPage from 'pages/ButtonPage';
import CardPage from 'pages/CardPage';
import ChartPage from 'pages/ChartPage';
// pages
import OrderPage from 'pages/OrderPage';
import InventoryPage from 'pages/InventoryPage';
import PurchasePage from 'pages/PurchasePage';
import SalesPage from 'pages/SalesPage';
import TapelinePage from 'pages/TapelinePage';
import LoomPage from 'pages/LoomPage';
import AddLoomPage from 'pages/AddLoomPage';
import CustomerPage from 'pages/CustomerPage';
import SupplierPage from 'pages/SupplierPage';
import ItemPage from 'pages/ItemPage';
import StereoPage from 'pages/StereoPage';
import QualityPage from 'pages/QualityPage';
import PrintingPage from 'pages/PrintingPage'
import CostingPage from 'pages/CostingPage'
import Sessions from 'pages/Sessions'
import axios from 'axios'

import DashboardPage from 'pages/DashboardPage';
import DropdownPage from 'pages/DropdownPage';
import FormPage from 'pages/FormPage';
import InputGroupPage from 'pages/InputGroupPage';
import ProgressPage from 'pages/ProgressPage';
import TypographyPage from 'pages/TypographyPage';
import WidgetPage from 'pages/WidgetPage';
import React from 'react';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Switch } from 'react-router-dom';
import './styles/reduction.scss';

const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config : {
        headers: {
          'Authorization': 'Bearer ',
        },
      },
    }
  }

  componentDidMount = () => {
    // let userPass = {
    //   "username": "abdullah",
    //   "password": "123"
    // };
    //   axios.post(
    //     'http://localhost:8000/api/token/',
    //     userPass
    //   ).then((response) => {
    //     let newObj = {
    //       access:response.data.access,
    //       refresh:response.data.refresh
    //     }
    //     this.setState({token:newObj}, () => {
    //       localStorage.setItem('token', JSON.stringify(this.state.token))
    //       console.log(this.state.token);
    //       this.getToken();
    //     })
    //   }).catch((error) => {
    //     console.log(error)
    //   });
  }

  getToken = () => {
      let tokenObj = JSON.parse(localStorage.getItem('token'));
      let newconfig = {
        headers: {
          'Authorization': 'Bearer ' + tokenObj.access
        }
      }
      this.setState({config : newconfig });
  }

  render() {
    return (
      <BrowserRouter basename={getBasename()}>
        <GAListener>
          <Switch>
            <LayoutRoute
              exact
              path="/login"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_LOGIN} getToken={this.getToken} />
              )}
            />
            <LayoutRoute
              exact
              path="/signup"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_SIGNUP} />
              )}
            />
            <LayoutRoute
              exact
              path="/login-modal"
              layout={MainLayout}
              component={AuthModalPage}
            />
            <LayoutRoute
              exact
              path="/"
              layout={MainLayout}
              component={DashboardPage}
            />
            <LayoutRoute
              exact
              path="/buttons"
              layout={MainLayout}
              component={ButtonPage}
            />
            <LayoutRoute
              exact
              path="/order"
              layout={MainLayout}
              component={props => (
              <OrderPage {...props}
            />)}/>
            <LayoutRoute
              exact
              path="/inventory"
              layout={MainLayout}
              component={props => (
                <InventoryPage {...props}
              />)}/>
            <LayoutRoute
              exact
              path="/purchase"
              layout={MainLayout}
              component={props => (
                <PurchasePage {...props}
              />)}/>
            <LayoutRoute
              exact
              path="/sales"
              layout={MainLayout}
              component={props => (
                <SalesPage {...props}
              />)}/>
              <LayoutRoute
              exact
              path="/costing"
              layout={MainLayout}
              component={props => (
                <CostingPage {...props}
              />)}/>
            <LayoutRoute
              exact
              path="/tapeline"
              layout={MainLayout}
              component={props => (
                <TapelinePage {...props}
              />)}/>
            <LayoutRoute
              exact
              path="/loom"
              layout={MainLayout}
              component={props => (
              <LoomPage {...props}
              />)}/>
            <LayoutRoute
              exact
              path="/addloom"
              layout={MainLayout}
              component={props => (
                <AddLoomPage {...props}
              />)}/>
            <LayoutRoute
              exact
              path="/supplier"
              layout={MainLayout}
              component={props => (
                <SupplierPage {...props}
              />)}/>
            <LayoutRoute
              exact
              path="/customer"
              layout={MainLayout}
              component={props => (
                <CustomerPage {...props}
              />)}/>
            <LayoutRoute
              exact
              path="/item"
              layout={MainLayout}
              component={props => (
                <ItemPage {...props}
              />)}/>
            <LayoutRoute
              exact
              path="/stereo"
              layout={MainLayout}
              component={props => (
                <StereoPage {...props}
              />)}/>
            <LayoutRoute
              exact
              path="/quality"
              layout={MainLayout}
              component={props => (
                <QualityPage {...props}
              />)}/>
            <LayoutRoute
              exact
              path="/printing"
              layout={MainLayout}
              component={props => (
                <PrintingPage {...props}
              />)}/>
            <LayoutRoute
              exact
              path="/cards"
              layout={MainLayout}
              component={CardPage}
            />
            <LayoutRoute
              exact
              path="/widgets"
              layout={MainLayout}
              component={WidgetPage}
            />
            <LayoutRoute
              exact
              path="/typography"
              layout={MainLayout}
              component={TypographyPage}
            />
            <LayoutRoute
              exact
              path="/alerts"
              layout={MainLayout}
              component={AlertPage}
            />
            <LayoutRoute
              exact
              path="/badges"
              layout={MainLayout}
              component={BadgePage}
            />
            <LayoutRoute
              exact
              path="/button-groups"
              layout={MainLayout}
              component={ButtonGroupPage}
            />
            <LayoutRoute
              exact
              path="/dropdowns"
              layout={MainLayout}
              component={DropdownPage}
            />
            <LayoutRoute
              exact
              path="/progress"
              layout={MainLayout}
              component={ProgressPage}
            />
            <LayoutRoute
              exact
              path="/forms"
              layout={MainLayout}
              component={FormPage}
            />
            <LayoutRoute
              exact
              path="/input-groups"
              layout={MainLayout}
              component={InputGroupPage}
            />
            <LayoutRoute
              exact
              path="/charts"
              layout={MainLayout}
              component={ChartPage}
            />
            <LayoutRoute
              exact
              path="/register"
              layout={MainLayout}
              component={AuthPage}
            />
            <Redirect to="/" />
          </Switch>
        </GAListener>
      </BrowserRouter>
    );
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
