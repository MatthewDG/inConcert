import React from 'react';
import { Link } from 'react-router';

export default class SidebarItem extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    const { video } = this.props;
    let linkPath = `/videos/${video.id}`

    return(
      <div className="sidebar-item">

        <Link to={linkPath}>
          <img className="sidebar-item-thumbnail"
            src={video.thumbnail_url}
            width={132}
            height={75} />
        </Link>

        <div className="sidebar-item-detail">
          <div>
            <Link className="sidebar-title" to={linkPath}>
              {video.title}
            </Link>
          </div>

          {/* Change this to link to user show when done */}
          <div>
            <Link className="sidebar-uploader" to="/">
              from {video.user.username}
            </Link>
          </div>
        </div>


      </div>
    )
  }
}