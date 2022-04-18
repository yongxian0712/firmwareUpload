import React, { useState, useEffect, useRef } from "react";
import { Accordion, Card, Button, Table, Form, Col } from "react-bootstrap";

const Attachment = ({handleFileChange}) => {

    const serverGrp = ["Development", "Staging","DAMA", "DSP", "International"];

    const [isDAMAShown, setDAMAShown] = useState(false);
    const [isDSPShown, setDSPShown] = useState(false);
    const [isInternationalShown, setInternationalShown] = useState(false);

    function disableCheck(server){
        return true ? server === "Development" || server === "Staging": false;
    }

    function handleCheckbox(event){
        if(event.target.checked){
            switch(event.target.value){
                case("DAMA"):
                    setDAMAShown(true);
                    break;
                case("DSP"):
                    setDSPShown(true);
                    break;
                case("International"):
                    setInternationalShown(true);
                    break;
                default:
                    console.log("Error!");
            }
        }
        else{
            switch(event.target.value){
                case("DAMA"):
                    setDAMAShown(false);
                    break;
                case("DSP"):
                    setDSPShown(false);
                    break;
                case("International"):
                    setInternationalShown(false);
                    break;
                default:
                    console.log("Error!")

            }
        }
    }

    function HideAttachment(svr){
        switch(svr){
            case("DAMA"):
                return isDAMAShown;
            case("DSP"):
                return isDSPShown;
            case("International"):
                return isInternationalShown;
            default:
                return true ? svr==="Development" || svr==="Staging" : false;
        }
    }

    const [files, setFiles] = useState([]);
    // onChange function that reads files on uploading them
    // files read are encoded as Base64
    function onFileChange(event) {
      //event.preventDefault();
      
      // Get the file Id
      let id = event.target.id;
      // Create an instance of FileReader API
      let file_reader = new FileReader();
      // Get the actual file itself
      let file = event.target.files[0];
      file_reader.onload = () => {
        // After uploading the file
        // appending the file to our state array
        // set the object keys and values accordingly
        setFiles([...files, { file_id: id, uploaded_file: file_reader.result }]);
      };
      // reading the actual uploaded file
      file_reader.readAsDataURL(file);
      handleFileChange(event);
    }

    return(
        <div>
        <Form.Label>Server</Form.Label>
            <Form.Group controlId="server_checkbox">
              {serverGrp.map((svr, idx) => (
                <Form.Check 
                  className="checkbox"
                  inline
                  key={idx} 
                  label={svr} 
                  value={svr}
                  disabled = {disableCheck(svr)}
                  defaultChecked = {disableCheck(svr)}
                  onChange={handleCheckbox}
                  >
                </Form.Check>
              ))}
            </Form.Group>
            <Form.Group controlId="file">
              <Form.Label>Attachment</Form.Label>
              <Card>
              {serverGrp.map((svr, idx) => (
              <Form.File 
                className="attachment" 
                id={svr}
                key={idx} 
                label={svr}  
                disabled={!HideAttachment(svr)} 
                onChange={onFileChange}/>
              ))}
              </Card>
            </Form.Group>
        </div>
    )
}
export default Attachment;