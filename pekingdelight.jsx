HomePage = new Mongo.Collection('home');
AboutUs = new Mongo.Collection('about');
Menus = new Mongo.Collection('menus');
OldMenus = new Mongo.Collection('old-menus');

if(Meteor.isServer) {
  Meteor.publish('menus', function() {
    return Menus.find({});
  });
  Meteor.publish('home',()=>{return HomePage.find({});});
  Meteor.publish('about',()=>{return Menus.find({});});

  // Check if user is authenticated
  const checkAuthenticated = ()=> {
    const authError = new Meteor.Error('Not authorized');
    var user = Meteor.user();
    if(Roles.userIsInRole(user, 'admin')) {
      return;
    }
    console.error('User', user, 'is not authorized to carry out transaction');
    throw authError;
  };
  const getMenu = (menuId)=> {
    return Menus.findOne({"_id":menuId});
  };
  const setMenu = (menuId, menu)=> {
    var menuBackup = Object.create(menu);
    // Create backup of menu with a new ID
    menuBackup._id = Random.id();
    menuBackup.createdEpoch = new Date().valueOf();
    OldMenus.insert(menuBackup);
    Menus.upsert(menuId, menu, (error, numAffected)=>{
      if(error) {
        throw new Meteor.Error('Database error', error);
      }
      console.log('Set', menuId, 'to', menu, 'with', numAffected, 'changed docs');
    });
  };
  Meteor.methods({
    deleteMenuItem: function(menuId, dishId) {
      checkAuthenticated();
      console.log('Deleting', menuId, dishId);
      var menu = getMenu(menuId);
      menu.dishes = menu.dishes.filter((val, idx)=> { return idx !== dishId; });
      setMenu(menuId, menu);
      return 'Deleted dish';
    },
    addMenuItem: function(menuId, dishProps) {
      checkAuthenticated();
      console.log('Adding menu item', dishProps, 'to menu', menuId);
      var menu = getMenu(menuId);
      menu.dishes.push(dishProps);
      setMenu(menuId, menu);
      return 'Added dish';
    },
    editMenuItem: function(menuId, dishId, dishProps) {
      checkAuthenticated();
      var menu = getMenu(menuId);
      menu.dishes[dishId] = dishProps;
      console.log('Editing dish in menu', menu);
      setMenu(menuId, menu);
      return 'Updated menu';
    },
    addMenu: function(menuTitle) {
      checkAuthenticated();
      console.log('Creating new menu', menuTitle);
      var menu = { menuTitle: menuTitle, dishes: [] };
      Menus.insert(menu);
      return 'Created menu';
    }
  });
}

if(Meteor.isClient) {
  Meteor.subscribe('home');
  Meteor.subscribe('menus');
  Meteor.subscribe('about');
}
