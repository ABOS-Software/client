import React from 'react';
import {Datagrid, List, TextField} from 'react-admin';

export const PostList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id"/>
            <TextField source="title"/>
            <TextField source="body"/>
        </Datagrid>
    </List>
);