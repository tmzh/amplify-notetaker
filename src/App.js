import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";
import { createNote, deleteNote, updateNote } from "./graphql/mutations";
import {
  onCreateNote,
  onDeleteNote,
  onUpdateNote,
} from "./graphql/subscriptions";
import { listNotes } from "./graphql/queries";

function App() {
  const [id, setId] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const getNotes = async () => {
    const result = await API.graphql(graphqlOperation(listNotes));
    setNotes(result.data.listNotes.items);
  };

  useEffect(() => {
    getNotes();
    const createNoteListener = API.graphql(
      graphqlOperation(onCreateNote)
    ).subscribe({
      next: (noteData) => {
        const newNote = noteData.value.data.onCreateNote;
        setNotes((prevNotes) => {
          const oldNotes = prevNotes.filter((note) => note.id !== newNote.id);
          const updatedNotes = [...oldNotes, newNote];
          return updatedNotes;
        });
        setNote("");
        setId("");
      },
    });

    const deleteNoteListener = API.graphql(graphqlOperation(onDeleteNote)).subscribe(
      {
        next: noteData => {
          const deletedNote = noteData.value.data.onDeleteNote;
          setNotes((prevNotes) => {
            const updatedNotes = prevNotes.filter(note => note.id !== deletedNote.id)
            return updatedNotes
          })

        }
      }
    )

    const updateNoteListener = API.graphql(graphqlOperation(onUpdateNote)).subscribe(
      {
      next: noteData => {
        const updatedNote = noteData.value.data.onUpdateNote
        setNotes((prevNotes) => {
          const index = prevNotes.findIndex(note => note.id === updatedNote.id)
          const updatedNotes = [
            ...prevNotes.slice(0, index),
            updatedNote,
            ...prevNotes.slice(index + 1)
          ]
          return updatedNotes
        })
      }})


    return () => {
      createNoteListener.unsubscribe();
      deleteNoteListener.unsubscribe();
    }
  }, []);

  const handleSetNote = async ({ note, id }) => {
    setNote(note);
    setId(id);
  };

  const handleUpdateNote = async () => {
    const input = { id, note };
    await API.graphql(graphqlOperation(updateNote, { input }));
    resetState();
  };

  const handleChangeNote = (event) => {
    setNote(event.target.value);
  };

  const hasExistingNote = () => {
    if (id) {
      return notes.findIndex((note) => note.id === id) > -1;
    }
    return false;
  };

  const resetState = () => {
      setNote("");
      setId("");
  }

  const handleAddNote = async (event) => {
    event.preventDefault();

    if (hasExistingNote()) {
      handleUpdateNote();
    } else {
      const input = { note };
      await API.graphql(graphqlOperation(createNote, { input }));
    }
    resetState();
  };

  const handleDeleteNote = async (noteId) => {
    const input = { id: noteId };
    await API.graphql(graphqlOperation(deleteNote, { input }));
  };

  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-l">Amplify Notetaker</h1>
      <form onSubmit={handleAddNote} className="mb3">
        <input
          type="text"
          className="pa2 f4"
          placeholder="Write your note"
          onChange={handleChangeNote}
          value={note}
        />
        <button className="pa2 f4" type="submit">
          {id ? "Update Note" : "Add Note"}
        </button>
      </form>
      <div>
        {notes.map((item) => (
          <div key={item.id} className="flex items-center">
            <div onClick={() => handleSetNote(item)} className="fl f3 w-90 pa1">
              {item.note}
            </div>
            <button
              onClick={() => handleDeleteNote(item.id)}
              className="bg-transparent bn fl f3 w-10 pa2"
            >
              <span>&times;</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
