import React from 'react';
import {connect} from 'react-redux';
import {getResources, MenuItemLink, Responsive} from 'react-admin';
import {withRouter} from 'react-router-dom';

const Menu = ({resources, onMenuClick, logout}) => (
    <div>
        {resources.map(resource => (
            <MenuItemLink to={`/${resource.name}`} primaryText={resource.name} onClick={onMenuClick}/>
        ))}
        <MenuItemLink to="/Reports" primaryText="Reports" onClick={onMenuClick}/>
        <Responsive
            small={logout}
            medium={null} // Pass null to render nothing on larger devices
        />
    </div>
);

const mapStateToProps = state => ({
    resources: getResources(state),
});

export default withRouter(connect(mapStateToProps)(Menu));
