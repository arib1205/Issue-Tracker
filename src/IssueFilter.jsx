import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { Col, Row, FormGroup, FormControl, ControlLabel, InputGroup, ButtonToolbar, Button } from 'react-bootstrap';

export default class IssueFilter extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      status: props.initFilter.status || '',
      effort_gte: props.initFilter.effort_gte || '',
      effort_lte: props.initFilter.effort_lte || '',
      changed: false,
    };
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeEffortGte = this.onChangeEffortGte.bind(this);
    this.onChangeEffortLte = this.onChangeEffortLte.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);

    // this.clearFilter = this.clearFilter.bind(this);
    // this.setFilterOpen = this.setFilterOpen.bind(this);
    // this.setFilterAssigned = this.setFilterAssigned.bind(this);
  }

  componentWillReceiveProps(newProps){
    this.setState({
      status: newProps.initFilter.status || '',
      effort_gte: newProps.initFilter.effort_gte || '',
      effort_lte: newProps.initFilter.effort_lte || '',
      changed: false,
    });
  }


  // setFilterOpen(e){
  //   e.preventDefault();
  //   this.props.setFilter({status: 'Open'});
  // }
  //
  // setFilterAssigned(e){
  //   e.preventDefault();
  //   this.props.setFilter({status: 'Assigned'});
  // }
  //
  // clearFilter(e){
  //   e.preventDefault();
  //   this.props.setFilter({})
  // }

  onChangeStatus(e){
    this.setState({status:e.target.value, changed: true});
  }

  onChangeEffortGte(e){
    const effortString = e.target.value;
    if(effortString.match(/^\d*$/)){
      this.setState({effort_gte: e.target.value, changed: true})
    }
  }

  onChangeEffortLte(e){
    const effortString = e.target.value;
    if(effortString.match(/^\d*$/)){
      this.setState({effort_lte: e.target.value, changed: true})
    }
  }

  applyFilter(){
    const newFilter = {};
    if(this.state.status) newFilter.status = this.state.status;
    if(this.state.effort_gte) newFilter.effort_gte = this.state.effort_gte;
    if(this.state.effort_lte) newFilter.effort_lte = this.state.effort_lte;
    this.props.setFilter(newFilter)
  }

  clearFilter(){
    this.props.setFilter({});
  }

  resetFilter(){
    this.setState({
      status: this.props.initFilter.status || '',
      effort_gte: this.props.initFilter.effort_gte || '',
      effort_lte: this.props.initFilter.effort_lte || '',
      changed: false,
    });
  }

  // render(){
  //   const Seperator = () => <span> | </span>;
  //   return(
  //       <div>
  //           {/* <Link to="/issues"> All issues </Link>
  //           <Seperator />
  //           <Link to="/issues?status=Open"> Open issues </Link>
  //           <Seperator />
  //           <Link to="/issues?status=Assigned"> Assigned issues </Link> */}
  //           {/* <Link to= {{pathname:'/issues',search:{status:'Open'}}}</Link> */}
  //           <a href="#" onClick={this.clearFilter}>All Issues</a>
  //           <Seperator />
  //           <a href="#" onClick={this.setFilterOpen}>Open Issues</a>
  //           <Seperator />
  //           <a href="#" onClick={this.setFilterAssigned}>Assigned Issues</a>
  //       </div>
  //   );
  // }

  // render(){
  //   return(
  //     <div>
  //       Status:
  //       <select value={this.state.status} onChange={this.onChangeStatus}>
  //         <option value="">(Any)</option>
  //         <option value="New">New</option>
  //         <option value="Open">Open</option>
  //         <option value="Assigned">Assigned</option>
  //         <option value="Fixed">Fixed</option>
  //         <option value="Verified">Verified</option>
  //         <option value="Closed">Closed</option>
  //       </select>
  //       &nbsp;Effort between:
  //       <input size={5} value={this.state.effort_gte} onChange={this.onChangeEffortGte} />
  //       &nbsp;-&nbsp;
  //       <input size={5} value={this.state.effort_lte} onChange={this.onChangeEffortLte} />
  //       &nbsp;
  //       <button onClick={this.applyFilter}>Apply Filter</button>
  //       <button onClick={this.resetFilter} disabled={!this.state.changed}>Reset Filter</button>
  //       <button onClick={this.clearFilter}>Clear</button>
  //     </div>
  //   );
  // }

  render(){
    return(
      <Row>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Status</ControlLabel>
            <FormControl componentClass="select" value={this.state.status} onChange={this.onChangeStatus}>
              <option value="">(Any)</option>
              <option value="New">New</option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="Fixed">Fixed</option>
              <option value="Verified">Verified</option>
              <option value="Closed">Closed</option>
            </FormControl>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Effort</ControlLabel>
            <InputGroup>
              <FormControl value={this.state.effort_gte} onChange={this.onChangeEffortGte} />
              <InputGroup.Addon>-</InputGroup.Addon>
              <FormControl value={this.state.effort_lte} onChange={this.onChangeEffortLte} />
            </InputGroup>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>&nbsp;</ControlLabel>
            <ButtonToolbar>
              <Button bsStyle="primary" onClick={this.applyFilter}>Apply</Button>
              <Button onClick={this.resetFilter} disabled={!this.state.changed}>Reset</Button>
              <Button onClick={this.clearFilter}>Clear</Button>
            </ButtonToolbar>
          </FormGroup>
        </Col>
      </Row>
    )
  }

}

IssueFilter.propTypes = {
  setFilter : PropTypes.func.isRequired,
  initFilter : PropTypes.object.isRequired,
}
