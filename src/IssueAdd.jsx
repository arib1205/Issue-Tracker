import React from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';

export default class IssueAdd extends React.Component{

  constructor(){
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e){
    e.preventDefault();
    var form = document.forms.issueAdd_form;
    this.props.createIssue({
      owner : form.owner.value,
      title : form.title.value,
      country : form.country.value,
      created : new Date(),
      // status : "New",
    });
    //clearing values for next input
    form.owner.value = "";
    form.title.value = "";
    form.country.value = "";
  }

  // render(){
  //   return(
  //     <div>
  //       <form name="issueAdd_form" onSubmit={this.handleSubmit}>
  //         <input type="text" id="owner" name="owner" placeholder="Enter owner details" />
  //         <input type="text" id="title" name="title" placeholder="Enter title details" />
  //         <input type="text" id="country_css" name="country" placeholder="Enter country" />
  //         <br />
  //         <button> Add </button>
  //       </form>
  //     </div>
  //   )
  // }

  render(){
    return(
      <div>
        <Form inline name="issueAdd_form" onSubmit={this.handleSubmit}>
          <FormControl id="owner" name="owner" placeholder="Enter owner details" />
          {' '}
          <FormControl id="title" name="title" placeholder="Enter title details" />
          {' '}
          <FormControl id="country_css" name="country" placeholder="Enter country" />
          {' '}
          <Button id="IssueAdd_subBut" type="submit" bsStyle="primary">Add</Button>
        </Form>
      </div>
    )
  }
}
