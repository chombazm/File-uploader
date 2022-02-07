const express = require('express');
const app = express();
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

const port = process.env.PORT || 3000
// [TODO: move this function to a separate file]
// const renameFile = (file) => (file + '_' + Date.now() + path.extname(file));

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        // const file = req.file.originalname;
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
})

// [TODO: add muliple file upload]
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('fileUploader');

const checkFileType = (file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true)
    }else {
        cb('Error: Images Only!');
    }
}

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));




app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home page'
    })
})
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                title: 'failed to upload image',
                msg : err + "could not upload file"
            })
            console.error(err)
        }else {
            // [TODO: upload image to database] 
             res.render('index', {
                title: 'File uploaded',
                 msg : "file uploaded successfully"
             })
        }
    })
    // console.log(req.files);
    // res.send('uploaded');
})
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})