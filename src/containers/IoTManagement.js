import { useState, useEffect } from "react";
import { onError } from "../lib/errorLib";
import { useFormFields } from "../lib/hooksLib";
import { Form, Alert, ListGroup, Table } from "react-bootstrap";
import { API } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import { Link } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";
import _ from 'lodash';
import "./IoTManagement.css";

export default function IoTManagement(){

  const [isLoading, setIsLoading] = useState(false);
  const [dashboard, setDashboard] = useState([]);
  const [isAdded, setAdded] = useState(false);
  const { isAuthenticated } = useAppContext();
  const [fields, handleFieldChange] = useFormFields({
    ThingType: "",
    Manufacturer: ""
  });

  function handleSubmit(event){
    event.preventDefault();

    setIsLoading(true);

    let ThingType = fields.ThingType;
    let Manufacturer = fields.Manufacturer;

    try{
      addThing({ThingType, Manufacturer});
      setAdded(true);
    }
    catch(e){
      onError(e);
      setIsLoading(false);
    }
  }
  
  function addThing(form) {
    return API.post("Firmware_CRUD", "/upload", {
      body: form
    });
  }

  function validateForm() {
    return fields.ThingType.length > 0 && fields.Manufacturer.length > 0;
  }

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const db = await loadDashboard();
        setDashboard(db);
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

  function renderSuccessMessage(thing, manu) {
    return (
      <Alert variant="success">
      <Alert.Heading>
        Added Successfully!
      </Alert.Heading>
        <hr />
        <p>
          An IoT Thing <strong>{manu} {thing}</strong> has been added successfully.
        </p>
        <hr/>
        <p>
        <Link to="/">
            Return to the Home page.
        </Link>
        </p>
      </Alert>
    );
  }

  function renderForm(){
    return(
    <div className="IoTManagement">
    <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="ThingType">
          <Form.Label>ThingType</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter a Thing Type"
            value={fields.ThingType}
            onChange={handleFieldChange}
          /> 
        </Form.Group>
        <Form.Group size="lg" controlId="Manufacturer">
          <Form.Label>Manufacturer</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter a Manufacturer"
            value={fields.Manufacturer}
            onChange={handleFieldChange}
          />                
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
        Add
        </LoaderButton>
    </Form>
  </div>
  )}

  function renderCurrentList(){
    return(
      <Table responsive className="table" bordered={true}>
        <thead className="header">
          <tr>
            <td>Thing Type</td>
            <td>Manufacturer</td>
          </tr>
        </thead>
        {console.log(dashboard)}
        {dashboard.map((value, idx) => 
        <tbody className="body">
          <tr>
            {Object.values(_.pick(value, "ThingType", "Manufacturer")).map((body, idx) => 
            <td>{body}</td>
            )}
            
          </tr>
        </tbody>
        )}
        
      </Table>
    )
  }

  return(
    (!isAdded) ?
    <div className="IoTDisplay">
    <ListGroup>{!isLoading && renderForm()}</ListGroup>
    <ListGroup className="list">{!isLoading && renderCurrentList()}</ListGroup>
    </div>:renderSuccessMessage(fields.ThingType, fields.Manufacturer)
  )

}