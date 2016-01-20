const imgStyleDefault = {
  width:  '64px',
  height: '64px'
};

InfoEntry = React.createClass({
  renderTitle() {
    return (
      <div className='media-heading'>
        <h4>{this.props.title}</h4>
        <Markdown>{this.props.body}</Markdown>
      </div>
    );
  },
  renderWell() {
    return (
      <div className='well'>
        <Markdown>{this.props.body}</Markdown>
      </div>
    );
  },
  renderImage() {
    var imgStyle = {};
    imgStyle.width = this.props.imgWidth || imgStyleDefault.width;
    imgStyle.height = this.props.imgHeight || imgStyleDefault.height;
    return (
      <div className='media-left'>
        <img style={imgStyle} className='media-object' src={this.props.img}></img>
      </div>
    );
  },
  render() {
    return (
      <div className='media'>
        {this.props.img ? this.renderImage() : null}
        <div className='media-body'>
          {(this.props.title || this.props.img) ? this.renderTitle() : this.renderWell()}
        </div>
      </div>
    );
  }
});

