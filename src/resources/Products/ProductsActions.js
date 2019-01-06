import {GET_LIST} from 'react-admin';

export const GET_Prod = 'COMMENT_APPROVE';
export const commentApprove = (id, data, basePath) => ({
    type: COMMENT_APPROVE,
    payload: {id, data: {...data, is_approved: true}},
    meta: {resource: 'comments', fetch: UPDATE},
});