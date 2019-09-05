import React, {PureComponent} from 'react';
import axios from 'axios';

class Rentals extends PureComponent {
constructor(props) {
super(props);

this.state = {
error: null,
isLoaded: false,
makes: [],
models: [],
};
}

componentDidMount = () => {
axios
.get("https://localhost:44308/api/v1/Rental/GetAll")
.then(result => {
this.setState({isLoaded: true, makes: result.data});
})
.catch(error => {
this.setState({isLoaded: true, error})
})
}

handleMakeChange = event => {

axios
.get(`https://localhost:44308/api/v1/Rental/GetByCriteria/${event.target.value}`)
.then(result => {
this.setState({models: result.data});
}).catch(error => {
this.setState(error);
})

}


render() {

const divStyle = {
margin: '10px',
color: 'red'
};

const selectStyle ={
  width: '500px'
};

const {error, isLoaded, makes, models} = this.state;
if (error) {
  return <div style={divStyle}>Error: {error.message}</div>;
} else if (!isLoaded) { 
  return <div>Loading...</div>
} else {
  return (
<div className="container">
  <div className="row">
    <div class="col-md-1">
      <label>Make</label>
    </div>
    <div className="col-mid-8">
      <select style={selectStyle} className="form-control" id="showMake" onChange={this.handleMakeChange}>
        {makes.map((item) => <option key={item.id} value={item.make}>{item.make}</option>)}
      </select>
    </div>
  </div>
  <div className="row">
    <div class="col-md-1">
      <label>Model</label>
    </div>
    <div className="col-mid-8">
      <select style={selectStyle} className="form-control" id="showModel">
        {models.map((item) => <option key={item.id} value={item.make}>{item.model}</option>)}
      </select>
    </div>
  </div>
</div>

);
}
}
}

export default Rentals;