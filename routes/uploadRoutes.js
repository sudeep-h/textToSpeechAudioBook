const express=require("express");
const router=express.Router();
const upload=require('../middlewares/multerConfig');
const {uploadFile}=require('../controllers/uploadController');


router.post("/upload",upload.single("pdf"),uploadFile); 
module.exports=router;  