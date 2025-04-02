const fs=require("fs");
const pdfParse=require("pdf-parse");
const path=require("path");
const textToSpeech=require("@google-cloud/text-to-speech");
const util=require("util");
require("dotenv").config();
const upload=require("../middlewares/multerConfig");

const client=new textToSpeech.TextToSpeechClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const audioDir = "public/audio";

if(!fs.existsSync(audioDir)) {  
    fs.mkdirSync(audioDir, { recursive: true }); 
}

const uploadFile=async (req,res)=>{ 
    try {
        if(!req.file){
            return res.status(400).json({error:"No file uploaded."});
        }
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
        }

        const [response]=await client.synthesizeSpeech(request);
        const audioFilePath=path.join(audioDir,`${req.file.filename}.mp3`);

        await util.promisify(fs.writeFile)(audioFilePath,response.audioContent,"binary");
        res.json({audioFilePath: `/audio/${req.file.filename}.mp3` });

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error."});
    }   

}

module.exports={uploadFile};


