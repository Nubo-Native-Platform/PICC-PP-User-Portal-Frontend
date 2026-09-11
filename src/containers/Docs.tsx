import React, { useEffect } from 'react'

const Docs = () => {

    useEffect(() => {
        window.location.replace(import.meta.env.VITE_DOCS_URL);
    }, [])

    return (
        <div>

        </div>
    )
}

export default Docs
