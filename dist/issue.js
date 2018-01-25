'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// 'use strict';

const validIssueStatus = {
  New: true,
  Open: true,
  Assigned: true,
  Fixed: true,
  Verified: true,
  Closed: true
};

const issueFieldType = {
  // id: 'required',
  status: 'required',
  owner: 'required',
  effort: 'optional',
  created: 'required',
  completionDate: 'optional',
  title: 'required',
  country: 'required'
};

function cleanupIssue(issue) {
  const cleanedUpIssue = {};
  Object.keys(issue).forEach(field => {
    if (issueFieldType[field]) {
      cleanedUpIssue[field] = issue[field];
    }
  });
  return cleanedUpIssue;
}

function validateIssue(issue) {
  const errors = [];
  Object.keys(issueFieldType).forEach(field => {
    if (issueFieldType[field] === 'required' && !issue[field]) {
      errors.push(`Missing mandatory field: ${field}`);
    }
  });

  if (!validIssueStatus[issue.status]) {
    errors.push(`${issue.status} is not a valid status.`);
  }

  return errors.length ? errors.join('; ') : null;
}

// function validateIssue(issue){
//   for(const field in issueFieldType){
//     const type = issueFieldType[field];
//     if(!type){
//       delete issue[field];
//     }
//     else if(type == 'required' && !issue[field]){
//       return `${field} is required`;
//     }
//   }
//
//   if(!validIssueStatus[issue.status]){
//     return `${issue.status} is not a valid status`
//   }
//
//   return null;
// }

// module.exports = {
//   validateIssue: validateIssue
// };

exports.default = {
  cleanupIssue: cleanupIssue,
  validateIssue: validateIssue
};
//# sourceMappingURL=issue.js.map