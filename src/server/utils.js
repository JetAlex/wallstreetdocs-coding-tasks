const fs = require('fs');
const path = require('path');
const config = require('../../config/config.json');

const pathToFile = (fileName = '') => path.join(__dirname, config.CACHE_FOLDER, fileName);


const saveFile = (props) => {
    const {fileName, data} = props;

    if (!fs.existsSync(pathToFile())){
        fs.mkdirSync(pathToFile());
    }

    fs.writeFile(pathToFile(fileName), JSON.stringify(data), () => {
        console.log('file:', fileName, 'has been created');
    });
};



module.exports = {
    saveFile,
    pathToFile
};
