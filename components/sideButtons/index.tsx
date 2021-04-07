import classes from './style.module.scss';
import { useState, useEffect } from 'react';
import { curry } from 'lodash';

function SideButtons({ onRevealFullImage }) {
    const [fibOpacity, setFibOpacity] = useState('0');

    useEffect(() => {
        const handler = setTimeout(() => {
            setFibOpacity('1');
        }, 27000);
        return () => {
            clearTimeout(handler);
        }
    });

    return <div className={classes.sideButton}>
        <div className={classes.fullImage} style={{opacity: fibOpacity}} onClick={onRevealFullImage}>Reveal full image</div>
    </div>
}

export default SideButtons
