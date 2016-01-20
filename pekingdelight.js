getAdmin = ()=> {
  if(Meteor.user && Meteor.user()) {
    var user = Meteor.user();
    if(user.props) {
      return (user.props.admin === true);
    }
  }
  return false;
}
