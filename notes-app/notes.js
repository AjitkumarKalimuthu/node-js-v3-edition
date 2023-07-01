// const name = 'Test';
// const getNotes = () => 'Your Notes ...';
// const add = (a, b) => a + b;
// module.exports = add;
const fs = require('fs');
const addNote = (title, body) => {
    const notes = loadNotes();
    const isDuplicateNote = notes.find(note => note.title === title);
    // debugger // Use cmd node inspect app.js to stop at debugger in chrome browser
    // In Chrome use chrome://inspect and open node dev tools.
    if (!isDuplicateNote) {
        notes.push({title, body});
        saveNotes(notes);
        console.log('New Note Added!');
    } else {
        console.log('Note Title Already taken!');
    }
};

const removeNote = (title) => {
    const notes = loadNotes();
    noteIndex = notes.findIndex(note => note.title === title);
    console.log(noteIndex);
    console.log(notes);
    if (noteIndex > -1) {
        notes.splice(noteIndex, 1);
        saveNotes(notes);
        console.log('Note Deleted!');
    } else {
        console.log('Note Not Exists!');
    }
};

const listNotes = () => {
    const notes = loadNotes();
    console.log('Your Notes!');
    notes.forEach((note, index) => console.log(index+1 + '. ' + note.title));
};

const readNote = (title) => {
    const notes = loadNotes();
    const note = notes.find(note => note.title === title);
    if (note) {
        console.log('Note Found');
        console.log(note);
    } else {
        console.log('Note Not Found');
    }
};

const saveNotes = (notes) => {
    fs.writeFileSync('notes.json', JSON.stringify(notes));
};

const loadNotes = () => {
    try {
        return JSON.parse(fs.readFileSync('notes.json').toString());
    } catch (e) {
        return [];
    }
};

module.exports = {addNote, loadNotes, removeNote, listNotes, readNote};