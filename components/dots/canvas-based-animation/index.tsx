import { useState, useEffect } from 'react'

export const defaultDotSizes = [2, 4, 8, 16, 30];

export default function Canvas({ file, dotSizes = defaultDotSizes }) {
    const [canvasId] = useState('canvasId');        /// TODO change to unique ID
    const [showcaseId] = useState('showcaseId');    /// TODO change to unique ID

    return <div></div>
}
