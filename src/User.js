import React from "react";
import Header from "globalCollections";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

function Profile() {
  return (
    <>
    <Header/>
    <hr/>
    <hr/>

    <hr/>
    <hr/>

    <hr/>
    <hr/>
      <div className="content">
        <Row >
          <Col style={{margin:'auto'}} md="4">
            <Card className="card-user">
              <div className="image">
                <img alt="..." src={require("assets/img/damir-bosnjak.jpg")} />
              </div>
              <CardBody style={{backgroundColor:'#343a40'}}>
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray"
                      src={'https://images.pexels.com/photos/2657669/pexels-photo-2657669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                    />
                    <h5 style={{color:'white'}} className="title">Developed By Mansur</h5>
                  </a>
                  <p  style={{color:'white'}} className="description">@mDA</p>
                </div>
                <p style={{color:'#EEE9F0'}} className="description text-center">
                 Like the Way You
                 <br />You test it !  
                 <br />
                </p>
              </CardBody>
              <CardFooter style={{backgroundColor:'#343a40'}}>
                <hr />
                <div  style={{color:'white'}} className="button-container">
                  <Row>
                    <Col className="ml-auto" lg="3" md="6" xs="6">
                      <h5>
                        12 <br />
                        <small>Collections</small>
                      </h5>
                    </Col>
                    <Col className="ml-auto mr-auto" lg="4" md="6" xs="6">
                      <h5>
                        7 mb <br />
                        <small>storage used</small>
                      </h5>
                    </Col>
                    <Col className="mr-auto" lg="3">
                      <h5>
                        6 <br />
                        <small>items</small>
                      </h5>
                    </Col>
                  </Row>
                </div>
              </CardFooter>
            </Card>
            <Card style={{backgroundColor:'#4B0082', color:'white'}}>
              <CardHeader>
                <CardTitle tag="h4">Team Members</CardTitle>
              </CardHeader>
              <CardBody style={{backgroundColor:'#343a40'}}>
                <ul className="list-unstyled team-members">
                  <li>
                    <Row>
                      <Col md="2" xs="2">
                        <div className="avatar">
                          <img
                            alt="..."
                            className="img-circle img-no-padding img-responsive"
                            src={'https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1600'}
                          />
                        </div>
                      </Col>
                      <Col md="7" xs="7">
                        Pavel <br />
                        <span className="text-success">
                          <small>Online</small>
                        </span>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                      <Col md="2" xs="2">
                        <div className="avatar">
                          <img
                            alt="..."
                            className="img-circle img-no-padding img-responsive"
                            src={'https://images.pexels.com/photos/3579181/pexels-photo-3579181.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                          />
                        </div>
                      </Col>
                      <Col md="7" xs="7">
                        Anfisa S. <br />
                          <span className="text-muted">
                            <small>Available</small>
                          </span>
                      </Col>
                    </Row>
                  </li>
                  <li>
                    <Row>
                      <Col md="2" xs="2">
                        <div className="avatar">
                          <img
                            alt="..."
                            className="img-circle img-no-padding img-responsive"
                            src={'https://images.pexels.com/photos/789303/pexels-photo-789303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                          />
                        </div>
                      </Col>
                      <Col className="col-ms-7" xs="7">
                        YanaSilyuk <br />
                        <span className="text-danger">
                          <small>Busy</small>
                        </span>
                      </Col>

                    </Row>
                  </li>
                </ul>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Profile;
