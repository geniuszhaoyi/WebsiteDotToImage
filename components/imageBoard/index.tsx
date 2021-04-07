import { useState, useEffect } from 'react';

import CanvasFileWrapper from '../canvasFileWrapper';

import classes from './style.module.scss';

const ImageBoard = ({ imageId }) => {
    return <div className={classes.imageContainer}>
      <div  className={classes.board}>
        <CanvasFileWrapper imageId={imageId}/>
      </div>
    </div>
}

export default ImageBoard;