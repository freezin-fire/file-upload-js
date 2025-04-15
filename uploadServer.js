const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const os = require('os');

const app = express();
const PORT = 3000;

const uploadDir = path.join(os.homedir(), 'Downloads');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up storage directory for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save files in the "uploads" directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Save with timestamp
    }
});

// Initialize Multer
const upload = multer({ storage: storage });

// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log('File uploaded:', req.file);
    res.status(200).json({
        message: 'File uploaded successfully',
        file: req.file
    });
});

// Serve a test HTML form (optional)
app.get('/', (req, res) => {
    res.send(`
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="file" />
            <button type="submit">Upload</button>
        </form>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

