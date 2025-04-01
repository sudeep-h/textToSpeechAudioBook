const express=require("express");
const multer=require("multer");
const fs=require("fs");
const cors=require("cors");
const pdfParse=require("pdf-parse");
const gtts=require("gtts");

const app=express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
const upload=multer({dest:"uploads/"});
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

        const audioFile = `${audioDir}/${req.file.filename}.mp3`;
        const gttsInstance=new gtts(text,"en");
        gttsInstance.save(audioFile,(err)=>{
            if(err) {
                console.error(err);
                res.status(500).send("Error generating audio file.");
            } else {
                res.json({audioUrl: `/audio/${req.file.filename}.mp3`});
            }
        });
    } catch(err) {
        console.error(err);
        res.status(500).send("Internal server error.");
    }
});  

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});