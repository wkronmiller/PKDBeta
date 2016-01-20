const {Link} = ReactRouter;
var Footer = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      user: Meteor.user()
    };
  },
  isAdmin() {
    // TODO
    return false;
  },
  render() {
    if(this.data.user) {
      return(<footer><a href='javascript:Meteor.logout()'>Log Out</a></footer>)
    }
    return (
      <footer><span><Link to='/logIn'>Log In</Link></span></footer>
    );
  }
});

App = React.createClass({
  render() {
    return (
      <div className='App'>
        <div className='container Navbar'><Navbar /></div>
        <div className='container Content'>{this.props.children}</div>
        <div className='footer'>
          <Footer />
        </div>
      </div>
    )
  }
});
