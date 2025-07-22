
import express from "express";

import {
  getPatient
} from "../../Controllers/DoctorsController/PatientForDocController.js";

const DocPatrouter = express.Router();



DocPatrouter.get("/",  getPatient);


export default DocPatrouter;
