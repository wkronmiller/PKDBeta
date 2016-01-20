const { Link } = ReactRouter;

var MenuNav = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var menus = Menus.find({}).fetch();
    return {
      userId: Meteor.userId(),
      menus: menus
    };
  },
  renderMenus() {
    return this.data.menus.map((menuCategory)=> {
      var link = 'menu/category/' + menuCategory._id.toString();
      return (<li key={menuCategory._id}><Link to={link}>{menuCategory.menuTitle}</Link></li>)
    });
  },
  getAddMenu() {
    if(Roles.userIsInRole(this.data.userId, 'admin')) {
      const addMenu = (event)=> {
        var menuTitle = document.getElementById('newMenuTitle').value;
        Meteor.call('addMenu', menuTitle);
      }
      return (
        <li>
          <div>
            <input
              type='text'
              className='form-control'
              placeholder='New Menu Title'
              id='newMenuTitle'></input>
            <button className='btn btn-default' onClick={addMenu}>Add Menu</button>
          </div>
        </li>
      );
    }
    return null;
  },
  render() {
    return (
      <div className='sidebar col-sm-3 col-md-2'>
        <h3>Menu Categories</h3>
        <ul className='nav'>
          {this.renderMenus()}
          {this.getAddMenu()}
        </ul>
      </div>
    );
  }
});

Menu = React.createClass({
  render() {
    return (
      <span>
        <div className='page-header'>
          <h1>Our Menus</h1>
        </div>
        <div className='container'>
          <MenuNav />
          <div className='col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 menu'>
            {this.props.children ? this.props.children: (<h3>Please Select a Menu</h3>)}
          </div>
        </div>
      </span>
    )
  }
});
