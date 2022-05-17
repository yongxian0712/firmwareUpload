import React, { useState, useEffect } from "react";
import { s3Upload } from "../lib/awsLib";
import { useFormFields } from "../lib/hooksLib";
import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import { API } from "aws-amplify";
import "./Home.css";
import { Accordion, Card, Button, Table, Form, Col, Alert, Modal, ListGroup } from "react-bootstrap";
import { Tab, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import _ from 'lodash';
import LoaderButton from "../components/LoaderButton";
import Attachment from "./Attachment";
import { TabList } from "react-tabs";
import { TabPanel } from "react-tabs";
import { useAdminContext } from "../lib/adminContext";
import {MdDelete} from "react-icons/md"

import config from "../config";
export default function Home() {

  const [dashboard, setDashboard] = useState([]);

  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const {isAdmin} = useAdminContext();

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);

  const [deleteStateManu, setDeleteStateManu] = useState();
  const [deleteStateThing, setDeleteStateThing] = useState();
  const [deleteStateFile, setDeleteStateFile] = useState();

  const handleShowModal = (event) => {
    setDeleteStateManu(event.target.getAttribute("data-delete-manu"));
    setDeleteStateThing(event.target.getAttribute("data-delete-thing"));
    setDeleteStateFile(event.target.getAttribute("data-delete-file"))
    setShowModal(true);
  }    
  
  const [isUploaded, setUploaded] = useState(false);

  const [fields, handleFieldChange] = useFormFields({
    version:"",
  });

  const [ThingType, setThingType] = useState();
  const [Manufacturer, setManufacturer] = useState();  
  
  const groupedThing = _.groupBy(dashboard, 'ThingType');
  const groupedManu = _.groupBy(groupedThing[ThingType], 'Manufacturer');

  function handleThingType(event){
    setThingType(event.target.value);
    setManufacturer(Object.keys(_.groupBy(groupedThing[event.target.value], 'Manufacturer'))[0]);
  }  

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
        const grp = _.groupBy(db, "ThingType");
        setThingType(Object.keys(grp)[0]); // set initial value for Form.select
        setManufacturer(Object.keys(_.groupBy(grp[Object.keys(grp)[0]], 'Manufacturer'))[0]); //set initial value for Form.select
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

  async function handleDelete(event){
    const svr = event.target.getAttribute('data-delete-server')
    const thing = deleteStateThing;
    const manu = deleteStateManu
    try{
      await deleteItem({thing, manu, svr});
      refreshPage();
    }
    catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteItem(form){
    return API.put("Firmware_CRUD", "/delete", {
      body: form
    })
  }

  const server = ["Development", "Staging", "DAMA", "DSP", "International"];

  function renderDashboardList() {
    return (
      <div className="dashboardList">
        <Tabs>
          <TabList>
            {server.map((svr, idx) => (
            <Tab key={idx}>{svr}</Tab>
            ))}
          </TabList>
          
      {server.map((svr) => (
        <TabPanel> 
        {Object.entries(_.groupBy(dashboard, 'ThingType')).map(([key, value], idx) => (
          !value.every(
            function hide(element){
              return !element['hasFile'+svr] //check if all data is visible, hide that ThingType if there is nothing to show
          }) ?
        <Accordion className="accordion" key={idx}>
          <Card key={idx}>        
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                {key}
              </Accordion.Toggle>
            </Card.Header> 
            <Accordion.Collapse eventKey="0">
              <Card.Body>    
                <Table responsive className="table" bordered={true}> 
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
                        {Object.values(_.pick(item, "Manufacturer", `File_Name_${svr}`, `Latest_Version_${svr}`)).map((body, idx)=>(
                        (item['hasFile'+svr]) ? 
                          <td className="align-middle" key={idx}>
                            {body} 
                          </td>
                        : 
                        <></>
                      ))}
                      {isAdmin ? 
                        (item['hasFile'+svr]) ?
                          <td className="deleteButtonContainer"><Button data-delete-manu={item['Manufacturer']} data-delete-thing={item['ThingType']} data-delete-file={item['File_Name_'+svr]}className="delete-button" variant="link"  style={{alignContent: "center"}} type="button" onClick={handleShowModal}><MdDelete className="icon"/></Button>
                              <Modal centered show={showModal} onHide={handleCloseModal}>
                              <Modal.Header closeButton>
                                <Modal.Title>Notification</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure you want to delete <strong>{deleteStateFile}</strong> in <strong>{svr}</strong> server?
                              </Modal.Body>
                              <Modal.Footer>
                                <Button variant="primary" onClick={handleCloseModal}>No</Button>
                                <Button variant="danger" data-delete-server={svr} onClick={handleDelete}>Yes, Proceed</Button>
                                </Modal.Footer>
                              </Modal>                          
                          </td>
                          : <></> 
                        : <></> }
                      </tr>

                    </tbody>
                    ))}
                </Table>
              </Card.Body>       
            </Accordion.Collapse>
          </Card> 
        </Accordion> : <></>
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

  const [files, setFiles] = useState([]);
  useEffect(() => {
  }, [files]);

  function handleFile(event){
    setFiles({...files, [event.target.id]: event.target.files[0]});
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      let ver = fields.version;
      let serverName = Object.keys(files); 
      serverName.map(async(svr, idx) => {
        let fileName = Object.values(files)[idx].name;
        config.s3.BUCKET = "uploadFirmware." + svr
        console.log(config.s3.BUCKET);
        const attachment = Object.values(files)[idx] ? await s3Upload(Object.values(files)[idx]) : null;
        return uploadFirmware({svr, ThingType, Manufacturer, ver, fileName});   
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