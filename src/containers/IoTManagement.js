import { useState } from "react";
import { onError } from "../lib/errorLib";
import { useFormFields } from "../lib/hooksLib";
import { Form } from "react-bootstrap";
import { API } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import { useHistory } from "react-router-dom";
import "./IoTManagement.css";

export default function IoTManagement(){

  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

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
      history.push("/");
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

  return(
    <div className="IoTManagement">
      <Form onSubmit={handleSubmit}>
          <Form.Group size="lg" controlId="ThingType">
            <Form.Label>ThingType</Form.Label>
            <Form.Control 
              type="text" 
              value={fields.ThingType}
              onChange={handleFieldChange}
            /> 
          </Form.Group>
          <Form.Group size="lg" controlId="Manufacturer">
            <Form.Label>Manufacturer</Form.Label>
            <Form.Control 
              type="text" 
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
  )

}