import Page from 'components/Page';
import React , { Component } from 'react';
import axios from 'axios';
import Typography from 'components/Typography';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardText,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Progress,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import classnames from 'classnames';

class InventoryPage extends Component {

    constructor (props) {
      super(props);
      this.state = {
        inventoryList:[],
        categoryList:[],
        stockList: [],
        totalValue: '',
        match : true,
        activeTab: '1',
      }
    }

    componentDidMount = () => {
      axios.get('http://localhost:8000/app/inventory/')
      .then(response => {
          this.setState({inventoryList: response.data});
          axios.get('http://localhost:8000/app/item_category/')
          .then(response => {
            let {HorizontalBar} = this.state;
              this.setState({categoryList: response.data});
              this.getYdata();
              this.setState({totalValue:this.getStockValue()});
            })})
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
      });
  };

    getYdata = () => {
      let {categoryList} = this.state;
      let {inventoryList} = this.state;
      let stock_quantity = [];
      let stock_price = []
      categoryList.map(category => {
        stock_quantity.push(
          inventoryList.filter(inventory => inventory.item_category == category.name)
            .reduce((acc, inventory) => acc + parseInt(inventory.quantity),0)
        );
      })
      categoryList.map(category => {
         stock_price.push (
         inventoryList.filter(inventory => inventory.item_category == category.name)
          .reduce((q,inventory) => q + parseInt(inventory.price),0)
         );
      });

      let {stockList} = this.state;
      
      for(let i in categoryList) {
        let newObject = {
          id:categoryList[i].id,
          name:categoryList[i].name,
          price:stock_price[i],
          quantity:stock_quantity[i],
        };
        stockList.push(newObject);
        this.setState({stockList:stockList});
      }
      return stock_quantity;

    }

    getStockValue = () => {
      let {inventoryList} = this.state;
      let totalValue = inventoryList.reduce((acc,inventory) => acc + parseInt(inventory.price) , 0);
      return totalValue;
    }

    toggle(tab){
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab
        });
      }
    }
    formatNumber = (num) => {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    removeZeros = (num) => {
      return num.replace(/(\.0)/g,"")
    }

render () {
  return (
    <Page className="header text-center" title="Inventory">
       <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
               onClick={() => { this.toggle('1'); }}
               style={{cursor:'pointer'}}>
              <h4 className = {`text-primary`}>
                Stock
              </h4>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
               onClick={() => { this.toggle('2'); }}
               style={{cursor:'pointer'}}>
              <h4 className = {`text-primary`}>
                Production
              </h4>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col lg="3" md="6" sm="8" xs="6">
                <Card>
                  <CardHeader className={`text-primary`}>
                    <h5>Stock Value</h5>
                  </CardHeader>
                  <CardBody>
                    <CardText tag="div" className="justify-content-center text-secondary">
                      <h4>{this.formatNumber(this.state.totalValue)} Rs</h4>
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="3" md="6" sm="8" xs="6">
                <Card>
                  <CardHeader className={`text-primary`}>
                      <h5>Stock Position</h5>
                    </CardHeader>
                  <CardBody>
                    <CardText tag="div" className="justify-content-center text-secondary">
                      <h4>3.5 days</h4>
                    </CardText>
                  </CardBody>
                </Card>
              </Col>

            </Row>
            <Row>
            <Col lg={6} md={6} sm={8} xs={12} className="mb-3">
              <Card>
                <CardHeader className="justify-content-center text-primary">
                      <h5>Stock Levels</h5>
                </CardHeader>
                <CardBody>
                  {this.state.stockList.map((stock,index) => (
                    <Col key ={index} className="mb-3">
                      <div className="d-flex justify-content-between">
                        <CardText>
                          <strong>{stock.name}</strong>
                        </CardText>
                        <CardTitle className={`text-secondary`}>
                          <Badge pill>{this.formatNumber(stock.quantity)} Kg</Badge>
                        </CardTitle>
                      </div>
                      <Progress value={stock.quantity} style={{ height: '25px' }}>
                        {stock.name}
                      </Progress>
                      <CardText tag="div" className="d-flex justify-content-between">
                        <Typography tag="span" className="text-right text-muted ">
                          {this.formatNumber(stock.price)} Rs
                        </Typography>
                      </CardText>
                      </Col>
                    ))}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="6">
                <Card body>
                  <CardTitle>Special Title Treatment</CardTitle>
                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                  <Button>Go somewhere</Button>
                </Card>
              </Col>
              <Col sm="6">
                <Card body>
                  <CardTitle>Special Title Treatment</CardTitle>
                  <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                  <Button>Go somewhere</Button>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    </Page>
  )
}
}

export default InventoryPage;
