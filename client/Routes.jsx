const { Router, Route, Link, IndexRoute, browserHistory } = ReactRouter;

var LogIn = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      user: Meteor.user()
    };
  },
  submitForm(event) {
    event.preventDefault();
    var email = event.target.email.value;
    var password = event.target.password.value;
    Meteor.loginWithPassword(email, password);
  },
  render() {
    var user = this.data.user;
    // Already logged in
    if(user && user.emails && user.emails.length > 0) {
      var email = user.emails[0].address;
      return (<div>You are logged in as {email}</div>);
    }
    // Not logged in
    return (
      <form onSubmit={this.submitForm} role='htmlForm'>
        <div className='htmlForm-group'>
          <label htmlFor='email'>Email</label><input type='email' className='htmlForm-control' id='email'></input>
        </div>
        <div className='htmlForm-group'>
          <label htmlFor='password'>Password</label><input type='password' className='htmlForm-control' id='password'></input>
        </div>
        <button type='submit' className='btn btn-default'>Log In</button>
      </form>
    );
  }
});

Meteor.startup(function() {
  ReactDOM.render((
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={Main} />
        <Route path='menu' name='menu' component={Menu}>
          <Route path='category/:id' component={MenuItem} />
        </Route>
        <Route path='about' name='about' component={About} />
        <Route path='logIn' name='logIn' component={LogIn} />
      </Route>
    </Router>
  ), document.getElementById('document-body'));
});
