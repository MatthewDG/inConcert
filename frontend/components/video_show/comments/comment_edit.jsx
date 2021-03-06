import React from 'react';

export default class CommentEdit extends React.Component{
  constructor(props){
    super(props);

    this.state = {body: this.props.comment.body, id: this.props.comment.id}
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  renderSubmit(){
    const { type, comment } = this.props;
    const { body } = this.state;

    const editButtonClass = type === "Video" ? "comment" : "reply" ;
    if(body.length === 0 || body === comment.body){
      return (
        <div className={`${editButtonClass}-button-container`}>
          <input type="submit" className={`${editButtonClass}-ui-button edit-comment-save-disabled`} value="Edit Comment" disabled/>
          <br></br>
        </div>
      )
    } else {
      return(
        <div className={`${editButtonClass}-button-container`}>
          <input type="submit" className={`${editButtonClass}-ui-button edit-comment-save`} value="Edit Comment"/>
          <br></br>
        </div>
      )
    }
  }

  handleInput(event){
   this.setState({ body : event.currentTarget.value });
  }

  handleSubmit(event){
    event.preventDefault();

    const { updateComment, toggleForm } = this.props;
    const comment = Object.assign({}, this.state);
    updateComment(comment).then(() => {
      this.setState({body: ""})
      toggleForm();
    });
  }

  render(){
    const editFormClass = this.props.type === "Video" ? "comment" : "reply" ;
    return(
      <div className={`${editFormClass}-form`}>

        <form className={`${editFormClass}-form-container`} onSubmit={this.handleSubmit}>
          <textarea className={`${editFormClass}-form-body`}
            onChange={this.handleInput}
            value={this.state.body}/>

          {this.renderSubmit()}

        </form>
      </div>
    )
  }
}
