const multer = require('multer');
const user = require('../_controllers/user.controller');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callBack) => {
            callBack(null, "_uploads")
        },
        filename: (req, file, callBack) => {
            const extension = file.originalname.split('.').pop();
            callBack(null, file.originalname + "_" + Date.now() + "." + extension)
        }
    })
}).array("document")

module.exports = (app) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
        res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Acc' + 'ess-Control-Request-Method, Access-Control-Request-Headers');
        res.header('Cache-Control', 'no-cache');
        next();
    });
    app.post('/api/user/signup', user.signup);
    app.get('/api/user/getById/:userId', user.getById);
    app.get('/api/user/getAll', user.getAll);
    app.post('/api/user/profile', upload, user.uploadImage);
}