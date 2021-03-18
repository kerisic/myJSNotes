//Note Class Object

class Note {
  constructor(id, title, body) {
    this.id = id;
    this.title = title;
    this.body = body;
  }
}
// declare noteID start as 1 if there are no notes yet and noteListBox where notes will live in HTML
var noteID = 1;
const noteListBox = document.querySelector("#notes-container");

// define and group eventlisteners
function eventListeners() {
  document.addEventListener("DOMContentLoaded", displayNotes);   // display existing notes when document is ready
  noteListBox.addEventListener("click", deleteNote);             // delete note when delete button is clicked
  makeURLChangeShowNoteForCurrentPage();                         // change display of note when specific note link is clicked
  addNewNoteListener()                                           // add and create note object/html when submit button is clicked
}

// invoke eventlisteners 
eventListeners();

// this waits for the click and adds it to local storage then make the new note appear on the page.
function addNewNoteListener() {
  var submit = document.getElementById("bttn");
  submit.addEventListener("click", function (event) {
    event.preventDefault();                                   // stop 'clicking the button' from doing anything
    var title = document.getElementsByName("title")[0];       // define title variable
    var content = document.getElementsByName("content")[0];   // define content variable
    var note = new Note(noteID, title.value, content.value);  // create a new Note object
    let notes = getDataFromStorage();                         // retrieve existing notes if any
    noteID++;                                                 // increment noteID since we've just made one
    notes.push(note);                                         // push the note object into notes
    createNote(note);                                         // create the note's html content
    localStorage.setItem("notes", JSON.stringify(notes));     // save updated notes into localstorage

    title.value = "";                                         // clear the input fields
    content.value = "";                                       
  });
};

// this creates the note object and displays it in html
function createNote(note) {
  const div = document.createElement("div");                       // create a div element and assign it to div
  div.classList.add("note-item");                                  // add a class to that div called note-item
  div.setAttribute("id", note.id);                            // set the data-id attribute of that div as the id of the note
  div.innerHTML = `                                                 
           <a href="#${note.id}">${note.body.substring(0, 20)}</a>
           <button type = "button" class = "btn delete-note-btn">
           Delete
           </buttton>
    `;
                                                                   // set the text content of that div as what you want to display
  noteListBox.appendChild(div);                                    // append the note's child div container to the bigger notes container
}

// this gets the notes object from local storage
function getDataFromStorage() {
  return localStorage.getItem("notes") ? JSON.parse(localStorage.getItem("notes")) : [];
}

// this converts the notes object from local storage into individual notes
function displayNotes() {
  let notes = getDataFromStorage();
  if (notes.length > 0) {
    noteID = notes[notes.length - 1].id;
    noteID++;
  } else {
    noteID = 1;
  }
  notes.forEach((item) => {
    createNote(item);
  });
}


// this allows us to delete the note made by targetting the parent class of the delete button clicked
function deleteNote(e) {
  if (e.target.classList.contains("delete-note-btn")) {  // if the event target's class contains 'delete-note-btn'
    e.target.parentElement.remove();                     // remove its parent element, which refers to the note div itself that the button is in
    let id = e.target.parentElement.id;                  // set new id variable from the notediv's dataset id
    let notes = getDataFromStorage();                    // retrieve most updated notes from local storage
    let newNotesList = notes.filter((item) => { 
      return item.id !== parseInt(id);                   // set new notes array with elements that dont contain the id that we are trying to delete
    });
    localStorage.setItem("notes", JSON.stringify(newNotesList)); // resave that notes object
  }
}

//multi links
 
function makeURLChangeShowNoteForCurrentPage() {                    // listener for when a link is clicked (that has a hash)
  window.addEventListener("hashchange", showNoteForCurrentPage);
}

function showNoteForCurrentPage() {                          // show the note on current page
  showNote(getNoteID(location));
}

function getNoteID(location) {                               // get the id of note wanted from link clicked
  return parseInt(location.hash.split("#")[1]);
}

function showNote(noteID) {                                  // show the body of the note by retrieving the right object from notes
  let notes = getDataFromStorage();
  note = notes.filter((item) => {
    return item.id === noteID
  });
  document.getElementById("note")
  emojify(note);
}

function emojify(note) {
  fetch('https://makers-emojify.herokuapp.com/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({text: `${note[0].body}`
      })
    })
    .then((response) => {
      return response.json()
    }).then(jsonresponse => { document.getElementById('note').innerHTML = `${jsonresponse.emojified_text}`})
  }
