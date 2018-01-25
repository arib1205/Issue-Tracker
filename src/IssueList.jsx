import React from 'react';
import 'whatwg-fetch';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import qs from 'query-string';
import { parse } from 'query-string';
import { Button, Glyphicon, Table, Panel } from 'react-bootstrap'

// import IssueAdd from './IssueAdd.jsx';
import IssueFilter from './IssueFilter.jsx';
import Toast from './Toast.jsx';

const IssueRow = (props) => {
  function onDeleteClick(){
    props.deleteIssue(props.issue_from_table._id);
  }
  return(
    <tr>
      <td><Link to={`/issues/${props.issue_from_table._id}`}>{props.issue_from_table._id.substr(-4)}</Link></td>
      <td>{props.issue_from_table.status}</td>
      <td>{props.issue_from_table.owner}</td>
      {/* <td><Link to={`/issues/${props.issue_from_table._id}`}>{props.issue_from_table.owner}</Link></td> */}
      <td>{props.issue_from_table.created.toDateString()}</td>
      <td>{props.issue_from_table.effort}</td>
      <td>{props.issue_from_table.completionDate ? props.issue_from_table.completionDate.toDateString() : ''}</td>
      <td>{props.issue_from_table.title}</td>
      <td>{props.issue_from_table.country}</td>
      <td>
        <Button bsSize="xsmall" onClick={onDeleteClick}><Glyphicon glyph="trash" /></Button>
      </td>
    </tr>
  )
}

function IssueTable(props) {
  const issueRows = props.issues.map(issue => <IssueRow key={issue._id} issue_from_table={issue} deleteIssue={props.deleteIssue}/>);
  return(
    // <table className="mytable">
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>Id</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Completion Date</th>
          <th>Title</th>
          <th>Country</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    {/* </table> */}
    </Table>
  )
}

IssueTable.propTypes = {
  issues: PropTypes.array.isRequired,
  deleteIssue: PropTypes.func.isRequired,
}


export default class IssueList extends React.Component{
  constructor(){
    super();
    this.state = {issues: [], toastVisible: false, toastMessage: '', toastType: 'success',};
    // this.createIssue = this.createIssue.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  componentDidMount(){
    this.loadData();
  }

  componentDidUpdate(prevProps){
    const oldQuery = parse(prevProps.location.search);
    const newQuery = parse(this.props.location.search);

    if(oldQuery.status === newQuery.status
      && oldQuery.effort_gte === newQuery.effort_gte
      && oldQuery.effort_lte === newQuery.effort_lte){
      return;
    }
    this.loadData();
  }

  loadData(){
    fetch(`/api/issues${this.props.location.search}`).then(response => {
      if(response.ok){
        response.json().then(data => {
          console.log("total records:", data.metadata.total_count);
          data.records.forEach(issue => {
            issue.created = new Date(issue.created);
            if(issue.completionDate){
              issue.completionDate = new Date(issue.completionDate);
            }
          });
          this.setState({issues: data.records});
        });
      }
      else {
        response.json().then(error => {
          // alert("Failed to fetch issues: " + error.message);
          this.showError("Failed to fetch issues: " + error.message);
        });
      }
    }).catch(err => {
      console.log(err);
      this.showError("Failed to fetch issues: " + err);
    });
  }

  showError(message){
    this.setState({ toastVisible: true, toastMessage: message, toastType: 'danger'});
  }

  dismissToast(){
    this.setState({ toastVisible: false })
  }

  deleteIssue(id){
    fetch(`/api/issues/${id}`, {method: 'DELETE'}).then(response => {
      if(!response.ok)alert('Failed to delete issue');
      else this.loadData();
    })
  }

  // createIssue(newIssue){
  //   fetch('/api/issues', {
  //     method: 'POST',
  //     headers: {'Content-Type':'application/json'},
  //     body: JSON.stringify(newIssue),
  //   }).then(response => {
  //     if(response.ok){
  //       response.json().then(updatedIssue => {
  //         updatedIssue.new_issue.created = new Date(updatedIssue.new_issue.created);
  //         if(updatedIssue.new_issue.completionDate)
  //         updatedIssue.new_issue.completionDate = new Date(updatedIssue.new_issue.completionDate);
  //         const newIssues = this.state.issues.concat(updatedIssue.new_issue);
  //         console.log("total records" + JSON.stringify(updatedIssue.metadata));
  //         this.setState({issues: newIssues});
  //       });
  //     }
  //     else{
  //       response.json().then(error => {
  //         // alert('Failed to add issue:' + error.message);
  //         this.showError('Failed to add issue:' + error.message);
  //       })
  //     }
  //   }).catch(err => {
  //     // alert("Error in sending data to server:" + err.message);
  //     this.showError("Error in sending data to server:" + err.message);
  //   });
  // }

  setFilter(query){
    // console.log(query.status)
    // console.log(qs.stringify(query));
    this.props.history.push({pathname: this.props.location.pathname, search:qs.stringify(query)});
  }

  render(){
    return(
      <div>
        {/* <h1>Issue Tracker</h1> */}
        <Panel>
          <Panel.Heading>
            <Panel.Title toggle>
              Filter
            </Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              <IssueFilter setFilter={this.setFilter}
               initFilter={parse(this.props.location.search)} />
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
        {/* <Panel Panel.collapse header="Filter">
          <IssueFilter setFilter={this.setFilter}
           initFilter={parse(this.props.location.search)}/>
        </Panel> */}
        {/* <hr /> */}
        <IssueTable issues = {this.state.issues} deleteIssue={this.deleteIssue}/>
        {/* <button onClick = {this.createTestIssue}> Add </button> */}
        {/* <hr /> */}
        {/* <IssueAdd createIssue = {this.createIssue}/> */}
        <Toast showing={this.state.toastVisible} message={this.state.toastMessage}
          onDismiss={this.dismissToast} bsStyle={this.state.toastType} />
      </div>
    );
  }
}

IssueList.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object,
};
