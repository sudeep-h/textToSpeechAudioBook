const express=require("express");
const multer=require("multer");
const fs=require("fs");
const cors=require("cors");
const pdfParse=require("pdf-parse");
const textToSpeech=require("@google-cloud/text-to-speech");
const util=require("util");

const app=express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

const upload=multer({dest:"uploads/"});
require("dotenv").config();
const client=new textToSpeech.TextToSpeechClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});


const audioDir = "public/audio";
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true }); 
}

app.post("/upload",upload.single("pdf"),async (req,res)=>{  
    try {
        const filePath=req.file.path;
        const dataBuffer=fs.readFileSync(filePath);
        const data=await pdfParse(dataBuffer);
        const text=data.text;

        const request={
            input: {text},
            voice: {
                languageCode: "en-IN",
                ssmlGender: "NEUTRAL",
            },
            audioConfig:{
                audioEncoding: "MP3",
            },
        };

        const [response]=await client.synthesizeSpeech(request);
        const audioFilePath=`${audioDir}/${req.file.filename}.mp3`;

        await util.promisify(fs.writeFile)(audioFilePath,response.audioContent,"binary");
        res.json({audioFilePath});
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal server error.");
    }
});  

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});