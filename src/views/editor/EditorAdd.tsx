import React, { useState } from 'react';
import { ContentState, convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { makeStyles } from '@material-ui/core';
import {GetCookieFunction} from "../../functions/Cookies";
import {convertToHTML} from 'draft-convert'
import {Redirect} from "react-router";

const useStyles = makeStyles({
    WrapperClass: {
        padding: "1rem",
        border: "1px solid #ccc",
    },
    EditorClass: {
        backgroundColor: "lightgray",
        padding: "1rem",
        border: "1px solid #ccc",
    },
    ToolbarClass: {
        border: "1px solid #ccc",
    }

})
const AddNote = (content:any, title: string) =>
{
    fetch("http://localhost:8080/note/add", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },

        body: JSON.stringify({title: title, notes:JSON.stringify(convertToRaw(content.getCurrentContent())), user:GetCookieFunction()})// body data type must match "Content-Type" header
    })
        .then((response) => {
            if(!response.ok){
                console.log("nope");
                return [];
            }
            else{
                return response.json();
            }
        })
        .then((res) => {
            if("fileId" in res){
                window.location.href = "/note/edit/" + res["fileId"];
            }
        })
}
const EditorAdd = () => {
    const classes = useStyles();
    const [title, setTitle] = useState('')
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    return (
        <div className="App">
            <input type="text" onChange={(e) => setTitle(e.target.value)} placeholder={"Tytuł"}></input><br/>
            <button onClick={() => AddNote(editorState, title)}>Send</button>
        </div>
    )
}

export default EditorAdd;
