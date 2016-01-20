// Main website app
Main = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var entries = HomePage.find({}, {sort: {orderNum: 1}}).fetch();
    return {
      entries: entries
    }
  }, 
  renderInfo() {
    return this.data.entries.map((entry)=>{
      return <InfoEntry key={entry._id} title={entry.title} body={entry.body} img={entry.img} imgWidth={entry.imgWidth} imgHeight={entry.imgHeight} />;
    });
  },
  render() {
    return (
      <span>
        <div className='page-header'>
          <h1>Welcome to Peking Delight!</h1>
        </div>
        <div>{this.renderInfo()}</div>
      </span>
    )
  }
});
