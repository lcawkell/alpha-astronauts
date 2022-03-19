import * as React from 'react';
import * as styles from './Row.css';

export interface IRowProps {
    children?:any
}

export interface IRowDataProps {
    children?:any
}

export function Row (props: IRowProps) {

    let { children } = props;

    return (
        <tr className={styles.row}>
            {children}
        </tr>
    );
}

export function Cell (props: IRowDataProps) {

    let { children } = props;

    //If ICell was passed, use it's value, otherwise just display child
    let value = children.hasOwnProperty('value') ? children.value : children; 

    return (
        <td className={styles.cell}>
            {value}
        </td>
    );
}