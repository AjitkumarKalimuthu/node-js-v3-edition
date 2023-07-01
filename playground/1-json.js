const fs = require('fs');
// const book = {
//     title: 'Ego is the Enemy',
//     author: 'Ryan Holiday'
// };
// const bookJSON = JSON.stringify(book); // Converting Object to JSON
// fs.writeFileSync('1-json.json', bookJSON);
// const bookDataBuffer = fs.readFileSync('1-json.json'); // Reading from file give Binary data
// const bookJSONFromFile = bookDataBuffer.toString(); // Converting to JSON string
// const bookObjFromFile = JSON.parse(bookJSONFromFile);
// console.log(bookObjFromFile.author);

// const data = {
//     name: 'ABC',
//     planet: 'Earth',
//     age: 20
// };
// const dataJSON = JSON.stringify(data); // Converting Object to JSON
// fs.writeFileSync('1-json-new.json', dataJSON);
const dataBuffer = fs.readFileSync('1-json-new.json'); // Reading from file give Binary data
const dataJSONFromFile = dataBuffer.toString(); // Converting to JSON string
const dataObj = JSON.parse(dataJSONFromFile);
dataObj.name = 'Ajitkumar';
dataObj.age = 27;
fs.writeFileSync('1-json-new.json', JSON.stringify(dataObj));