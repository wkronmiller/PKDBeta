var MenuElem = React.createClass({
  renderLunchDinner() {
    return (
      <span>
        <span>{this.props.lunchPrice} Lunch &#47;</span>
        <span>{this.props.dinnerPrice} Dinner</span>
      </span>
    );
  },
  renderDishName() {
    return (<td>{this.props.dishName}</td>);
  },
  renderDishPrice() {
    return (
      <td>
        {this.props.dishPrice ? this.props.dishPrice : this.renderLunchDinner()}
      </td>
    );
  },
  render() {
    return (
      <tr>
        {this.renderDishName()}
        {this.renderDishPrice()}
        {this.props.children}
      </tr>
    );
  }
});

var MenuDeleteButton = React.createClass({
  propTypes: {
    dishId: React.PropTypes.number.isRequired,
    menuId: React.PropTypes.string.isRequired
  },
  deleteItem(event) {
    Meteor.call('deleteMenuItem',
                this.props.menuId,
                this.props.dishId,
      (error,result)=>{
        if(error) {
          alert(error);
        } else {
          console.log(result);
        }
      });
  },
  render() {
    return (
      <td>
        <a onClick={this.deleteItem} href='javascript:()=>{location.reload();}'>Delete</a>
      </td>
    );
  }
});

var MenuEditSave = React.createClass({
  propTypes: {
    dishId: React.PropTypes.number.isRequired,
    menuId: React.PropTypes.string.isRequired
  },
  saveEdit(event) {
    var rowChildren = event.target.parentNode.parentNode.children;
    // Data structure to upsert
    var saveData = {};
    // Recursive helper function to get data out of row
    var getData = (domNode, saveData)=> {
      // Base case
      if(domNode.nodeName === 'INPUT') {
        //Empty string means undefined
        var value = (domNode.value === '') ? undefined : domNode.value;
        saveData[domNode.id] = value;
        return saveData;
      }
      // Recursive operation
      for(var index = 0; index < domNode.children.length; index++) {
        saveData = getData(domNode.children[index], saveData);
      }
      return saveData;
    }
    for(var index = 0; index < rowChildren.length; index++) {
      var child = rowChildren[index].children[0];
      saveData = getData(child, saveData);
    }
    // Send data to server
    Meteor.call('editMenuItem',
                this.props.menuId,
                this.props.dishId,
                saveData,
      (error,result)=>{
        if(error) {
          alert(error);
        }
        console.log(result);
      }
    );
  },
  render() {
     return(<td><button className='btn' onClick={this.saveEdit}>Save Edit</button></td>);
  }
});

var MenuAddSave = React.createClass({
  propTypes: {
    menuId: React.PropTypes.string.isRequired
  },
  saveNew(event) {
    var rowChildren = event.target.parentNode.parentNode.children;
    // Data structure to upsert
    var saveData = {};
    // Recursive helper function to get data out of row
    var getData = (domNode, saveData)=> {
      // Base case
      if(domNode.nodeName === 'INPUT') {
        //Empty string means undefined
        var value = (domNode.value === '') ? undefined : domNode.value;
        saveData[domNode.id] = value;
        // Clear entry
        domNode.value = '';
        return saveData;
      }
      // Recursive operation
      for(var index = 0; index < domNode.children.length; index++) {
        saveData = getData(domNode.children[index], saveData);
      }
      return saveData;
    }
    for(var index = 0; index < rowChildren.length; index++) {
      var child = rowChildren[index].children[0];
      saveData = getData(child, saveData);
    }
    // Send data to server
    Meteor.call('addMenuItem',
                this.props.menuId,
                saveData,
      (error,result)=>{
        if(error) {
          alert(error);
        }
        console.log(result);
      }
    );
  },
  render() {
     return(<td><button className='btn' onClick={this.saveNew}>Add New Dish</button></td>);
  }
});

var MenuElemEditor = React.createClass({
  propTypes: {
    submitButton: React.PropTypes.element.isRequired,
    menuId: React.PropTypes.string.isRequired
  },
  render() {
    return (
      <tr>
        <td>
          <div id='descriptions'>
            <input
              type='text'
              className='form-control'
              placeholder='Dish Name'
              defaultValue={this.props.dishName}
              id='name'></input>
            <input
              type='text'
              className='form-control'
              placeholder='Description'
              defaultValue={this.props.dishDescription}
              id='description'></input>
          </div>
        </td>
        <td>
          <div id='prices'>
            <input
              type='text'
              className='form-control'
              placeholder='Main Price'
              defaultValue={this.props.dishPrice}
              id='price'></input>
            <input
              type='text'
              className='form-control'
              placeholder='Lunch Price'
              defaultValue={this.props.lunchPrice}
              id='lunchPrice'></input>
            <input
              type='text'
              className='form-control'
              placeholder='Dinner Price'
              defaultValue={this.props.dinnerPrice}
              id='dinnerPrice'></input>
          </div>
        </td>
        {this.props.submitButton}
      </tr>
    );
  }
});

MenuItem = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    var menuCategory = Menus.find({_id: this.props.params.id}).fetch();
    if(menuCategory.length > 0) {
      menuCategory = menuCategory[0];
    } else {
      menuCategory = null;
    }
    return {
      menuCategory: menuCategory,
      userId: Meteor.userId()
    }
  },
  getItemChildren(dish) {
    if(Roles.userIsInRole(this.data.userId, 'admin')) {
      return (
        <MenuDeleteButton
          menuId={this.props.params.id}
          dishId={dish.index}
        />
      );
    }
    return null;
  },
  getNextRow(dish) {
    if(Roles.userIsInRole(this.data.userId, 'admin')) {
      return (
        <MenuElemEditor
          key={dish.name + 'editor'}
          menuId={this.props.params.id}
          dishId={dish.index}
          dishName={dish.name}
          dishDescription={dish.description}
          dishPrice={dish.price}
          dinnerPrice={dish.dinnerPrice}
          lunchPrice={dish.lunchPrice}
          submitButton={<MenuEditSave dishId={dish.index} menuId={this.props.params.id} />}
        />
      );
    }
    return null;
  },
  getAddRow() {
    if(Roles.userIsInRole(this.data.userId, 'admin')) {
      dish = {}
      return (
        <MenuElemEditor
          key={dish.name + 'editor'}
          menuId={this.props.params.id}
          dishId={dish.index}
          dishName={dish.name}
          dishDescription={dish.description}
          dishPrice={dish.price}
          dinnerPrice={dish.dinnerPrice}
          lunchPrice={dish.lunchPrice}
          submitButton={<MenuAddSave menuId={this.props.params.id} />}
        />
      );
    }
    return null;
  },
  renderItems() {
    var rows = [];
    for(var index = 0; index < this.data.menuCategory.dishes.length; index++) {
      var dish = this.data.menuCategory.dishes[index];
      dish.index = index;
      rows.push(<MenuElem
                  key={dish.name}
                  dishName={dish.name}
                  dishPrice={dish.price}
                  dinnerPrice={dish.dinnerPrice}
                  lunchPrice={dish.lunchPrice}
                  children={this.getItemChildren(dish)}
                />
      );
      rows.push(this.getNextRow(dish));
    }
    return rows;
  },
  render() {
    var id = this.props.params.id;
    if(this.data.menuCategory === null) {
      return (<h3>Database error. Please e-mail wrk961@msn.com</h3>);
    }
    return (
      <div>
        <h3>{this.data.menuCategory.menuTitle}</h3>
        <div><table className='table table-striped'>
          <thead>
            <tr><td>Dish</td><td>Price</td></tr>
          </thead>
          <tbody>
            {this.renderItems()}
            {(Roles.userIsInRole(this.data.userId, 'admin')) ? <tr><td>New Dish</td><td></td><td></td></tr> : null }
            {this.getAddRow()}
          </tbody>
        </table></div>
      </div>
    );
  }
});
