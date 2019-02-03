import React from 'react';

import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import {InputWrapper} from './InputWrapper';

export class UserListItem extends React.PureComponent {
  static defaultProps = {
    onClick: (event) => {
    }
  };
  state = {
    checked: false
  };

  /*    setChecked = event => {
          const {userName, user, handleManageCheckBoxChange} = this.props;
          this.setState({checked: event.target.checked});

          handleManageCheckBoxChange(userName, user)(event);
      }; */



  componentDidMount () {
    this.setState({checked: this.props.checked});
  }

  render () {
    const {user, children, onClick, checked, handleManageCheckBoxChange, userName} = this.props;
    return (
      <ListItem button onClick={onClick}>
        <InputWrapper>
          <Checkbox
            checked={checked}
            onChange={handleManageCheckBoxChange(userName, user)}
            value={user}
          />
        </InputWrapper>
        <ListItemText primary={user}/>
        {children}
      </ListItem>
    );
  }
}

UserListItem.propTypes = {
  user: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  handleManageCheckBoxChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.node
};
