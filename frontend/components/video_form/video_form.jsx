import React from 'react';
import Dropzone from 'react-dropzone';
import Halogen from 'halogen';
import { hashHistory } from 'react-router';
import { get } from 'lodash';

export default class VideoForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      title: "",
      description: "",
      videoFile: null,
      videoUrl: null,
      thumbUrl: null,
      user_id: this.props.currentUser.id,
      uploading: false,
      fileTooLarge: false
    }

    this.updateFile = this.updateFile.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.setThumbnail = this.setThumbnail.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount(){
      this.props.clearErrors([]);
      if(this.props.router.location.pathname === "/upload"){
        this.setState({title: "",
          description: "",
          user_id: this.props.currentUser.id,
          videoFile: null,
          videoUrl: null,
          thumbUrl: null,
          uploading: false})
      } else {
        let videoId = this.props.params.id
        this.props.fetchSingleVideo(videoId).then((video) => {
          let fillVideo = video.video
          this.setState({title: fillVideo.title,
            description: fillVideo.description,
            user_id: fillVideo.user_id,
            videoFile: fillVideo.video_url,
            thumbUrl: fillVideo.thumbnail_url,
            uploading: false})
      })
    }
}

  componentWillReceiveProps(nextProps){
    this.setState({ uploading: false })
    $('#upload-spinner').css("display", "none")
    if(nextProps.router.location.pathname === "/upload"){
          this.setState({title: "",
            description: "",
            user_id: this.props.currentUser.id,
            videoFile: null,
            videoUrl: null,
            thumbUrl: null,
            uploading: false})
        }
       else if(nextProps.router.location.pathname !== this.props.location.pathname) {
        this.props.clearErrors([]);
        let videoId = nextProps.params.id
        this.props.fetchSingleVideo(videoId).then((video) => {
          let fillVideo = video.video
          this.setState({title: video.title,
            description: fillVideo.description,
            user_id: fillVideo.user_id,
            videoFile: fillVideo.video_url,
            thumbUrl: fillVideo.thumbnail_url,
            uploading: false})
      })
  }

}



  handleSubmit(e){
    e.preventDefault();
    const { processVideoForm } = this.props;
    const { title, description, user_id, videoFile, thumbUrl  } = this.state

    let formData = new FormData();
    formData.append("video[title]", title);
    formData.append("video[description]", description);
    if(videoFile){
      formData.append("video[videoitem]", videoFile);
      formData.append("video[thumbnail]", thumbUrl);
    }

    formData.append("video[user_id]", user_id);
    this.setState( { uploading: true } )
    processVideoForm(formData).then((video) => {
      hashHistory.push(`/videos/${video.video.id}`)
    });
  }

  handleUpdate(e){
    e.preventDefault();
    const { processVideoForm } = this.props;
    let videoId = this.props.params.id


    let formData = new FormData();

    formData.append("video[title]", this.state.title);
    formData.append("video[description]", this.state.description);

    let postProcessFetch = this.props.fetchSingleVideo;
    processVideoForm(formData, videoId).then(() => {
      postProcessFetch(videoId).then(() => {
        hashHistory.push(`/videos/${videoId}`)
      })
    });
  }


  updateFile(file){
    let fileReader = new FileReader();
    fileReader.onloadend = function () {
      this.setState({videoFile: file, videoUrl: fileReader.result})
    }.bind(this);

    if(file){
      fileReader.readAsDataURL(file);
    }
  }

  onDrop(files){
    $('.dropzone-video-upload').css("background-color", "white")
    if(files[0].size/1024/1024 < 500){
      this.extractFrame(files);
      this.updateFile(files[0]);
      this.setState({ fileTooLarge: false });
    } else {
      this.setState({ fileTooLarge: true });
    }
  }


  onDragEnter(){
    $('.dropzone-video-upload').css("transition", "0.2s");
    $('.dropzone-video-upload').css("background-color", "rgb(212, 215, 223)");
  }
  onDragLeave(){
    $('.dropzone-video-upload').css("background-color", "white")
  }
  extractFrame(files) {

    let video = document.getElementById('video-preview')
    let canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d');

    function initCanvas(e) {
      canvas.width = this.videoWidth;
      canvas.height = this.videoHeight;
    }

    function drawFrame(e) {
      this.pause();
      ctx.drawImage(this, 0, 0);
      document.getElementById('preview-thumbnail').src = canvas.toDataURL();
    }

    video.autoplay = true;
    video.muted = true;

    video.addEventListener('loadedmetadata', initCanvas, false);
    video.addEventListener('loadeddata', drawFrame, false);

    video.src = URL.createObjectURL(files[0]);
    video.src += "#t=15";
  }

  renderUploadThumbnail(){
    if(this.state.thumbUrl === null){
      return(
        <div className="file-upload">
          <Dropzone
            className="dropzone-video-upload"
            multiple={false}
            accept="video/*"
            onDragEnter={this.onDragEnter}
            onDragLeave={this.onDragLeave}
            onDrop={this.onDrop}>
            <div>
              <div className="placeholder">
                <h1 className="dropzone-text">Drag video file here to upload</h1>
              </div>
              {this.renderFileSizeInstruction()}
            </div>
          </Dropzone>
        </div>
      )
    } else {
      return(
        <img id="dropzone-preview"src={this.state.thumbUrl} />
      )
    }
  }

  renderFileSizeInstruction(){
    if(this.state.fileTooLarge){
      return (<div className="file-size-instruction">
        <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
        File greater than 500 MB! Try again.
      </div>
    );
    } else {
      return <div className="file-size-instruction">Maximum file size: 500 MB</div>
    }
  }

  setThumbnail(){
    let thumbUrl = document.getElementById('preview-thumbnail').src;
    this.setState({ thumbUrl });
  }

  handleDelete(e){
    let videoId = this.props.params.id;

    this.props.deleteVideo(videoId).then(() => {
      hashHistory.push("/")
    });
  }

  renderDelete(){
    if(this.props.formType === "upload"){
      return null;
    } else {
      return(
        <input type="submit" id="video-delete" onClick={this.handleDelete} value="Delete Video"/>
      )
    }
  }

  renderUpload(buttonText, submitHandler){
    if(this.state.uploading){
      return(<input id="video-submit-disabled" type="submit" value={buttonText} onClick={submitHandler} disabled/>)
    } else {
      return(<input id="video-submit" type="submit" value={buttonText} onClick={submitHandler}/>);
    }
  }

  renderErrors(){
    let errors = this.props.errors
    if(!get(errors, 'length', 0)){ return null; }
    return(
      <ul className="error-message video-form-error">
        {Object.keys(errors).map( (id, idx) => (
          <li key={`error-${idx}`}>
            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
            {`${id.charAt(0).toUpperCase() + id.slice(1)} ${errors[id]}`}
          </li>
        ))}
      </ul>
    );
  }

  handleInput(event){
   this.setState({ [event.currentTarget.id]: event.currentTarget.value });
  }


  renderSpinner(){
    if(this.state.uploading){
      return(<Halogen.PulseLoader color={"#4bf"} className="spinner" id="upload-spinner"/>);
    } else{
      return null;
    }
  }

  render(){
    const { formType, location, currentUser, video } = this.props;

    const headerText = formType === "upload" ? "Upload your videos" : "Update video info"
    const buttonText = formType === "upload" ? "Upload Video" : "Update Video"
    const submitHandler = formType === "upload" ? this.handleSubmit : this.handleUpdate

    if(location.pathname.includes("edit")){
      if(!video){
        return null;
      }
      if(currentUser.id !== video.user_id){
        return null;
      }
    }
    return(
      <div className="video-form-container">
        <h1 className="video-form-title">{headerText}</h1>
        {this.renderErrors()}
        <form id="video-form" onSubmit={submitHandler}>
          <div className="video-inputs">
            {this.renderUploadThumbnail()}
              <div className="input-fields">
                <label className="input-label">
                  Title
                  <br />
                  <input type="text"
                    onChange={this.handleInput}
                    value={this.state.title}
                    placeholder="Title"
                    className="title-input"
                    id="title" />
                </label>
                <br />
                <label className="input-label">
                  Description
                  <br />
                  <textarea onChange={this.handleInput}
                    value={this.state.description}
                    className="description-input"
                    id="description" />
                </label>
              </div>


          </div>

          <video id="video-preview"></video>
          <canvas id="canvas"></canvas>
          <br />

        </form>
        <div className="form-buttons">
          {this.renderUpload(buttonText, submitHandler)}
          {this.renderDelete()}
          {this.renderSpinner()}
        </div>
        <img onLoad={this.setThumbnail} id="preview-thumbnail" hidden={true} />


      </div>
    )
  }
}
