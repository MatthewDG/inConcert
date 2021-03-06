import React from 'react';
import CommentEdit from './comment_edit';
import CommentForm from './comment_form';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router';

export default class CommentItem extends React.Component{
  constructor(props){
    super(props);

    this.state = ({
      deleteModal: false,
      form: false,
      replyForm: false,
      commentSettings: false
    })

    this.triggerDeleteModal = this.triggerDeleteModal.bind(this);
    this.removeDeleteModal = this.removeDeleteModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.showCommentSettings = this.showCommentSettings.bind(this);
    this.hideCommentSettings = this.hideCommentSettings.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.toggleReplyForm = this.toggleReplyForm.bind(this);
    this.closeReplyForm = this.closeReplyForm.bind(this);
  }

  renderCommentSettings(){
    const { type } = this.props;

    let containerClassName = type === "Video" ? "parent-settings" : "reply-settings";
    let settingsClassName = type === "Video" ? "comment-settings-item" : "reply-settings-item";
    if(this.state.commentSettings){
      return(
        <div className={`update-delete-settings ${containerClassName}`}>
          <span className={settingsClassName} id="edit-comment" onClick={this.toggleForm}>Edit</span>
          <span className={settingsClassName} id="delete-comment" onClick={this.triggerDeleteModal}>Delete</span>
        </div>
      )
    } else {
      return null;
    }
  }

  showCommentSettings(event){
    const { currentUser, comment, type } = this.props;
    if(currentUser){
      if(currentUser.id === comment.user_id){
        if(type === "Comment"){
          this.setState( {commentSettings: true } )
        } else if(!event.target.className.includes("reply") && !event.target.parentElement.className.includes("reply")){
          this.setState( {commentSettings: true } );
        }
      }
    }
  }

  hideCommentSettings(event){
    if(event.relatedTarget){
      if(event.relatedTarget.className !== "comment-settings-item"
          && event.relatedTarget.className !== "reply-settings-item"
          && !event.relatedTarget.className.includes("ui-button")){
        this.setState( { commentSettings: false } )
      }

      if(this.props.type === "Video" && event.currentTarget.className.includes("reply")){
        this.setState( { commentSettings: false } )
      }
    }
  }


  toggleForm() {
    this.setState({form: !this.state.form});
    this.setState({deleteModal: false});
  }

  //Toggles reply form from link
  toggleReplyForm(){
    this.setState({replyForm: !this.state.replyForm});
  }

  //Closes reply form upon submit
  closeReplyForm(){
    this.setState({replyForm: false})
  }

  renderEditModal(){
    const { comment, updateComment, type } = this.props;
    let bodyClass = type === "Video" ? "comment-body" : "reply-body";
    if(this.state.form){
      return(
        <CommentEdit comment={comment} updateComment={updateComment} toggleForm={this.toggleForm} type={type} />
      )
    } else {
      return(
        <p className={bodyClass}>{comment.body}</p>
      )
    }
  }

  triggerDeleteModal(){
    this.setState({form: false})
    this.setState({deleteModal: true});
  }

  removeDeleteModal(){
    this.setState({deleteModal: false})
  }

  handleDelete(event){
    event.preventDefault();
    const { deleteComment, comment } = this.props;
    deleteComment(comment.id)
    this.removeDeleteModal();
  }


  renderDeleteModal(){
    const parentType = this.props.type === "Video" ? "comment-deleter" : "reply-deleter"
    if(this.state.deleteModal){
      return(
        <div className={`${parentType} delete-comment-confirm-container`}>
          <div className={`${parentType} delete-notification`}>
            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
            <p>Are you sure you want delete this comment permanently?</p>
          </div>
          <div className={`${parentType} delete-actions`}>
            <button id="delete-comment-confirm" onClick={this.handleDelete}>Delete comment</button>
            <button id="delete-comment-cancel" onClick={this.removeDeleteModal}>Cancel</button>
          </div>
        </div>
      )
    } else { return null }
  }

  renderTimeAgo(){
    const { comment } = this.props;
    if(comment.comment_date){
      return(<TimeAgo className="comment-item-timeago" date={comment.comment_date} />);
    } else {
      return (<span className="comment-item-timeago">Just Now</span>)
    }
  }

  renderReplies(){
    const { currentUser, errors, updateComment, deleteComment, clearErrors } = this.props;

    if(this.props.replies){
      return (
        <div className="comment-replies">
          {this.props.replies.map((reply, idx) => {
            return <CommentItem key={`${this.props.comment.id}-${idx}`}
              comment={reply}
              type="Comment"
              replies={null}
              currentUser={currentUser}
              updateComment={updateComment}
              deleteComment={deleteComment}
              clearErrors={clearErrors}
              errors={errors}/>
          })
        }

      </div>);
    } else {
      return null;
    }
  }

  renderReplyToggle(){
    if(this.props.currentUser){
      return <span className="reply-activate-link" onClick={this.toggleReplyForm}>Reply</span>
    } else {
      return null;
    }
  }

  renderReplyForm(){
    const { video, comment, errors, currentUser, createComment, clearErrors } = this.props;
    if(this.state.replyForm){
      return(
        <div onSubmit={this.closeReplyForm}>
          <CommentForm currentUser={currentUser}
            comment={comment}
            type={"Comment"}
            createComment={createComment}
            video={video}
            errors={errors}
            clearErrors={clearErrors}
            onSubmit={this.closeReplyForm}/>
        </div>
      )
    } else {
      return null;
    }
  }

  render(){

    const { comment, type } = this.props;

    if(type === "Video"){
      return(
        <div className="comment-item" onMouseOver={this.showCommentSettings} onMouseOut={this.hideCommentSettings}>
          {this.renderCommentSettings()}
          <img className="commentor-avatar" src={comment.author.comment_avatar_url}/>
          <div className="comment-body">
            <Link to={`/users/${comment.author.id}`} className="comment-author">{comment.author.username}</Link>
            {this.renderTimeAgo()}
            {this.renderEditModal()}

            <br />
            {this.renderDeleteModal()}
            {this.renderReplies()}
            {this.renderReplyForm()}
          </div>
          {this.renderReplyToggle()}
        </div>
      )
    } else if(type === "Comment"){
      return(
        <div className="reply-item" onMouseOver={this.showCommentSettings} onMouseOut={this.hideCommentSettings}>
          <img className="reply-avatar" src={comment.author.comment_avatar_url}/>
          <div className="reply-body-container">
            {this.renderCommentSettings()}
            <Link to={`/users/${comment.author.id}`} className="reply-author">{comment.author.username}</Link>
            {this.renderTimeAgo()}
            {this.renderEditModal()}



            <br />
            {this.renderDeleteModal()}
          </div>
        </div>
      )
    }
  }
}
