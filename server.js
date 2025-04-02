const express=require("express");
const cors=require("cors");
const uploadRoutes=require("./routes/uploadRoutes");
require("dotenv").config();

const app=express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

app.use("/api",uploadRoutes);

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});