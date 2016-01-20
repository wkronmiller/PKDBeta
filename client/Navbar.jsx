const { Link } = ReactRouter;

const mainLinks = (
  <ul className='nav navbar-nav'>
    <li><Link to='/' activeClassName='active'>Home</Link></li>
    <li><Link to='menu'>Menu</Link></li>
    <li><Link to='about'>About Us</Link></li>
  </ul>
);

Navbar = React.createClass({
  getInitialState() {
    return {};
  },
  render() {
    return (
      <nav className='navbar navbar-default clearfix' role='navigation'>
        <div className='navbar-header'>
          <a className='navbar-brand'>Peking Delight Chinese Restaurant</a>
          <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='#mainNav'><span className='glyphicon glyphicon-menu-hamburger'></span></button>
        </div>
        <div className='collapse navbar-collapse' id='mainNav'>
          {mainLinks}
        </div>
      </nav>
    );
  }
});
