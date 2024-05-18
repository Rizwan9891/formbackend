const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: "appgamecenter2022",
    api_key: "728541827421589",
    api_secret: "VaW97US-r8LdRutjONx0TnuNU60",
});
exports.upload = (files) => {
    return new Promise((resolve, reject) => {
        if (files.document) {
            if (files.document.length == undefined) {
                cloudinary.v2.uploader.upload(files.document.filepath, { folder: 'documents' }).then((uploaded) => {
                    let name = element.originalFilename.substring(0, element.originalFilename.indexOf('.'));
                    let type = 'image'
                    if (uploaded.format == "pdf") {
                        type = 'pdf'
                    }
                    let doc = {
                        name: name,
                        type: type,
                        url: uploaded.secure_url
                    }
                    resolve(doc);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                let count = 0;
                let allImages = []
                files.document.forEach(element => {
                    let document = new Promise((resolve, reject) => {
                        cloudinary.v2.uploader.upload(element.filepath, { folder: 'documents', }).then((uploaded) => {
                            let name = element.originalFilename.substring(0, element.originalFilename.indexOf('.'));
                            let type = 'image'
                            if (uploaded.format == "pdf") {
                                type = 'pdf'
                            }
                            let doc = {
                                name: name,
                                type: type,
                                url: uploaded.secure_url
                            }
                            resolve(doc);
                        }).catch((err) => {
                            reject(err);
                        });
                    });
                    document.then((document) => {
                        allImages.push(document);
                        count++;
                        if (count == files.document.length) {
                            resolve(allImages);
                        }
                    })
                });
            }
        }
    });
}