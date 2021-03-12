import { useEffect, useState } from "react";
import _uniqueId from 'lodash/uniqueId';

import classes from '../style.module.scss';

export default function DotComponent({ dot }) {

    const [ disappear, setDisappear ] = useState({});

    const handleDisappear = () => {
        setDisappear({
            // display: 'none',
            opacity: 0,
            pointerEvents: 'none',
        })
    }

    return <div className={classes.dot} style={{ ...dot.style, ...disappear }} onMouseOver={handleDisappear}>
        <div className={classes.dotColor} style={dot.colorStyle}></div>
    </div>
}
