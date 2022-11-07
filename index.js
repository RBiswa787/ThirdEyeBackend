require("dotenv").config();
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const express = require("express");
const cors = require("cors");

const app = express();

let corsOptions = {
    origin: ["*"]
};

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get('/',(req,res) => {
    res.send("Welcome to backend!");
});

app.post('/clarifai',(req,res) =>{
    var data = req.body.hello;
    var newdata = data.replace("data:application/octet-stream;base64,", "");
    //console.log(data);
    //console.log(newdata);
    const buffer = Buffer.from(newdata, "base64");
    //console.log(buffer);
    const USER_ID = 'rbiswa003';
const PAT = 'b7261ceb2acb49dabc1d6a13b0322134';
const APP_ID = 'my-first-application';
const MODEL_ID = 'general-image-recognition';
const MODEL_VERSION_ID = '';
//const IMAGE_FILE_LOCATION = 'C:/Users/biswa/Downloads/imgg.jpg';



const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

const fs = require("fs");
//const imageBytes = fs.readFileSync(IMAGE_FILE_LOCATION);
console.log(buffer);
stub.PostModelOutputs(
    {
        user_app_id: {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        model_id: MODEL_ID,
        version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version.
        inputs: [
            { data: { image: { base64: buffer } } }
        ]
    },
    metadata,
    (err, response) => {
        if (err) {
            throw new Error(err);
        }
        /*
        if (response.status.code !== 10000) {
            throw new Error("Post model outputs failed, status: " + response.status.description);
        }*/

        // Since we have one input, one output will exist here.
        const output = response.outputs[0];

        console.log("Predicted concepts:");
        /*
        for (const concept of output.data.concepts) {
            console.log(concept.name + " " + concept.value);
        }*/
        console.log(output.data.concepts);
        res.statusCode = 200;
        return res.send(output.data.concepts);
    }
);



    
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
    console.log(`Server listening at port ${PORT}`);
});