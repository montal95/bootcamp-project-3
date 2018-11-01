import React from "react";
import "./Modal.css";

const Modal = (props) => (
    <div
        className="modal fade modalNote"
        tabIndex="-1"
        role="dialog"
        id={`noteModal${props._id}`}
        aria-labelledby="noteModalLabel"
        aria-hidden="true"
    >
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="noteModalLabel">Comment Section - {props.title}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>


                <div className="modal-body">

                    {
                        props.notes.map(notes => (
                            <div className="card" key={notes._id}>
                                <div className="card-body">
                                    <p className="otherNotes"> {notes.body}</p>
                                    <button type="button" className="btn btn-danger deleteComment" data-note-id={notes._id}
                                        data-article-id={notes.article} onClick={() => props.deleteCommentButton(notes.article, notes._id)}>X</button>
                                </div>
                            </div>

                        ))
                    }

                    <form>
                        <div className="form-group">
                            <label htmlFor="message-text" className="col-form-label">Comment:</label>
                            <textarea className="form-control" id={`noteText${props._id}`} onChange={props.handleChange} placeholder="Type your comment here"></textarea>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary saveComment" data-id={props._id} onClick={() => props.saveCommentButton(props._id)}>Save Comment</button>
                </div>
            </div>
        </div>
    </div>
);

export default Modal;
