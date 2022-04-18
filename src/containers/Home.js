import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useFormFields } from "../lib/hooksLib";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import { API } from "aws-amplify";
import "./Home.css";
import { Accordion, Card, Button, Table, Form, Col, Alert } from "react-bootstrap";
import { Tab, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import _ from 'lodash';
import LoaderButton from "../components/LoaderButton";
import Attachment from "./Attachment";
import { TabList } from "react-tabs";
import { TabPanel } from "react-tabs";

export default function Home() {

  const [dashboard, setDashboard] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  const groupedThing = _.groupBy(dashboard, 'ThingType');
  const groupedManu = _.groupBy(dashboard, 'Manufacturer');
  
  const [isUploaded, setUploaded] = useState(false);

  const [fields, handleFieldChange] = useFormFields({
    version:"",
  });

  const [ThingType, setThingType] = useState();
  useEffect(() => {
  }, [ThingType]);

  function handleThingType(event){
    setThingType(event.target.value);
  }

  const [Manufacturer, setManufacturer] = useState();
  useEffect(() => {
  }, [Manufacturer]);

  function handleManufacturer(event){
    setManufacturer(event.target.value)
  }

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        const db = await loadDashboard();
        setDashboard(db);
        setThingType(Object.keys(_.groupBy(db, "ThingType"))[0]); // set initial value for Form.select
        setManufacturer(Object.keys(_.groupBy(db, "Manufacturer"))[0]); //set initial value for Form.select
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);

  function loadDashboard() {
    return API.get("Firmware_CRUD", "/dashboard");
  }

  const server = ["Development", "Staging", "DAMA", "DSP", "International"];

  function renderDashboardList() {

    return (
      <div className="dashboardList">
        <Tabs>
          <TabList>
            {server.map((svr) => (
            <Tab>{svr}</Tab>
            ))}
          </TabList>
          
      {server.map((svr) => (
        <TabPanel> 
        {Object.entries(_.groupBy(dashboard, 'ThingType')).map(([key, value], idx) => (  
        <Accordion className="accordion">
          <Card key={idx}>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                {key}
              </Accordion.Toggle>
            </Card.Header> 
            <Accordion.Collapse eventKey="0">
              <Card.Body> 
                         
                <Table responsive className="table" bordered={true} > 
                    <thead>
                      <tr>
                        <th>Manufacturer</th>
                        <th>{`File_Name_${svr}`}</th>
                        <th>{`Latest_Version_${svr}`}</th>
                      </tr>
                    </thead>
                    {value.map((item, idx) =>(
                    <tbody key={idx}>
                      <tr>
                        {Object.values(_.pick(value[idx], "Manufacturer", `File_Name_${svr}`, `Latest_Version_${svr}`)).map((body, idx)=>(
                        ((item['hasFile'+svr])) ?
                        <td key={idx}>
                          {body}
                        </td>
                        : console.log()
                      ))}  
                      </tr>
                    </tbody>
                    ))}
                </Table>  
                
              </Card.Body>       
            </Accordion.Collapse>
          
          </Card> 
        </Accordion> 
        ))} 
        
        </TabPanel>
      ))}  
        </Tabs>
        
      </div>
    );
  }

  function validateForm() {
    return fields.version.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
  
    try {
      let ver = fields.version;
      let serverName = Object.keys(files); 
      serverName.map((svr, idx) => {
        let fileName = Object.values(files)[idx].name;
        return uploadFirmware({svr, ThingType, Manufacturer, ver, fileName})   
      })
      setUploaded(true);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
    
  }
  
  function uploadFirmware(form) {
    return API.put("Firmware_CRUD", "/upload", {
      body: form
    });
  }

  const [files, setFiles] = useState([]);
  useEffect(() => {
  }, [files]);

  function handleFile(event){
    setFiles({...files, [event.target.id]: event.target.files[0]});
  } 

  function renderForm(){
    return (
      <div className="form">
        <Form onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} controlId="thingtype">
              <Form.Label>ThingType</Form.Label>
              <Form.Control as={"select"} value={ThingType} onChange={handleThingType}>
                {Object.keys(groupedThing).map((thingType, idx) => (
                  <option value={thingType} key={idx}>{thingType}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col} controlId="manufacturer">
              <Form.Label>Manufacturer</Form.Label>
              <Form.Control as={"select"} value={Manufacturer} onChange={handleManufacturer}>
                {Object.keys(groupedManu).map((manufacturer, idx) => (
                  <option value={manufacturer} key={idx}>{manufacturer}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="version">
              <Form.Label>Version</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter the version number"
                value={fields.version}
                onChange={handleFieldChange}      
              />
            </Form.Group>
          </Form.Row>
            <Attachment handleFileChange={handleFile}/>
            <LoaderButton
              block
              type="submit"
              size="lg"
              variant="primary"
              isLoading={isLoading}
              disabled={!validateForm()}
            >
            Upload
            </LoaderButton>
        </Form>
        
      </div>
    )
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Firmware Upload Platform</h1>
        <p className="text-muted">Just Upload it</p>
      </div>
    );
  }

  function renderDashboard() {
    return (
      (!isUploaded)?
      <div className="dashboard">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Dashboard</h2>
        <ListGroup>{!isLoading && renderDashboardList()}</ListGroup>
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Upload</h2>
        <ListGroup>{!isLoading && renderForm()}</ListGroup>
      </div> :renderUploadSuccessMessage()
    );
  }
  
  function renderUploadSuccessMessage() {

    return (
      <Alert variant="success">
      <Alert.Heading>
        Your File(s) has been uploaded successfully.
      </Alert.Heading>
        <hr />
        <p>
          
        <Button variant="link" onClick={refreshPage}>
            Return to Home Page.
        </Button>
        </p>
      </Alert>
    );
  }

  function refreshPage(){ 
    window.location.reload(); 
  }

  return (
    <div className="Home">
      {!isAuthenticated ? renderLander() 
        : renderDashboard()}
    </div>
  );
}