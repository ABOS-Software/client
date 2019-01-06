const issueTypes = [
    {id: 'bug', value: 'bug', text: 'Bug', title: 'Bug'},
    {id: 'improvement', value: 'improvement', text: 'Improvement', title: 'Improvement'},
    {id: 'epic', value: 'epic', text: 'Epic', title: 'Epic'},
    {id: 'story', value: 'story', text: 'Story', title: 'Story'}
];
const IssueTypesEditor = <DropDownEditor options={issueTypes}/>;