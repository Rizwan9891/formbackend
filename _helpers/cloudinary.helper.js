const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: "appgamecenter2022",
    api_key: "728541827421589",
    api_secret: "VaW97US-r8LdRutjONx0TnuNU60",
});
exports.upload = (files) => {
    return new Promise((resolve, reject) => {
        if (files.file) {
            cloudinary.v2.uploader.upload(files.file.filepath, { folder: 'files' }).then((uploaded) => {
                resolve(uploaded.secure_url);
            }).catch((err) => {
                console.log(err)
                reject(err);
            });
        }
    });
}