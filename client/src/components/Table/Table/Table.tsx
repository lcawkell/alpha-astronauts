import * as React from 'react';
import * as styles from './Table.css';

import { Heading, HeadingData } from '../Heading';
import { Row, Cell } from '../Row';

export interface ITableProps {
    children?:any
}

export interface ITableHeadProps {
    children?:any
}

export interface ITableBodyProps {
    children?:any
}

export interface ITableFootProps {
    children?:any
}

export function Table (props: ITableProps) {

    let { children } = props;

    return (
        <table className={styles.table}>
            <caption></caption>
            {children}
        </table>
    );
}

export function TableHead (props: ITableHeadProps) {

    let { children } = props;

    return (
        <thead>
            {children}
        </thead>
    );
}

export function TableBody (props: ITableBodyProps) {

    let { children } = props;

    return (
        <tbody>
            {children}
        </tbody>
    );
}

export function TableFoot (props: ITableFootProps) {

    let { children } = props;

    return (
        <tfoot>
            {children}
        </tfoot>
    );
}