import * as React from 'react';

import * as styles from './Heading.css';

export interface IHeadingProps {
    children?:any
}

export interface IHeadingDataProps {
    children?:any
}

export function Heading (props: IHeadingProps) {

    let { children } = props;

    return (
        <tr className={styles.heading}>{children}</tr>
    );
}

export function HeadingData (props: IHeadingDataProps) {

    let { children } = props;

    return (
        <th className={styles.cell}>{children}</th>
    );
}