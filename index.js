const express = require('express');
const app = express()
const mongoose = require('mongoose')
const GridfsStorage = require('multer-gridfs-storage')


const bodyParser = require('body-parser')


const dblink = "mongodb+srv://arif:arif@cluster0.7cgsl.gcp.mongodb.net/videoStorage"

// mongoose.connect(dblink , {
//     useUnifiedTopology : true ,
//     useNewUrlParser : true
// },(err)=>{
//     if(!err) console.log("Db Connected");
// })

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
    extended: true
}))

const multer = require('multer')
const path = require('path')


// var Storage = multer.diskStorage({
//     destination: './public/uploads/',
//     filename: function (req, file, callback) {
//         callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname + path.extname(file.originalname));
//     }
// });


// var upload = multer({
//     storage: Storage
// }).array('video')



app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('./public'))
app.use(express.static((__dirname + '/public/')));


const fs = require('fs')
const formidable = require('formidable')
const crypto = require('crypto')

const videoSchema = require('./models/video')


app.get("/video/:filename", (req, res) => {
    // console.log('id', req.params.id)
    const file = gfs
        .find({
            filename: req.params.filename
        })
        .toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({
                    err: "no files exist"
                });
            }
            gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        });
});


app.get("/", (req, res) => {

    gfs.find().toArray((err, files) => {
        // check if files
        if (!files || files.length === 0) {
            return res.render("index", {
                files: false
            });
        } else {
            const f = files
                .map(file => {
                    return file;
                })
                // .sort((a, b) => {
                //     return (
                //         new Date(b["uploadDate"]).getTime() -
                //         new Date(a["uploadDate"]).getTime()
                //     );
                // });

            return res.render("index", {
                files: f
            });
        }
    });
});









const conn = mongoose.createConnection(dblink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let gfs;
conn.once("open", () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "video"
    });
});

const storage = new GridfsStorage({
    url: dblink,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname + Date.now()
            const fileInfo = {
                filename: file.fieldname,
                bucketName: "video"
            };
            console.log("In GFS Storage ", fileInfo);
            resolve(fileInfo);
        });
    }
});

const upload = multer({
    storage: storage
});


app.post('/', upload.any(), (req, res) => {

    console.log("POST REQUEST:");

    new formidable.IncomingForm().parse(req)
        .on('fileBegin', (name, file) => {
            file.path = __dirname + '/public/uploads/' + "video_" + Date.now() + "_"
            console.log(file.path);
        })
        .on('file', (name, file) => {
            console.log('Uploaded file', name, file)
        })

})

const PORT = process.env.PORT || 8500;

app.listen(PORT, console.log(`Server started on port ${PORT}`));