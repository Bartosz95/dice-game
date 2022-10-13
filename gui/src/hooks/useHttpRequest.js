import { useState, useCallback } from 'react';

export default () => {
    const [ alertMessage, setAlertMessage] = useState(null)
    const [ renderContent, setRenderContent] = useState(false)

    const fetchData = useCallback(async (requestOptions, auth, dataCallback) => {
        setRenderContent(true)
        setAlertMessage(null)
        try {
            if(auth.authenticated) {
                const response = await fetch(
                    requestOptions.url, {
                    method: requestOptions.method || 'GET',
                    headers: {
                        ...requestOptions.headers || null,
                        'Authorization': `Bearer ${auth.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestOptions.body) || null
                })
    
                if(!response.ok) {
                    throw new Error('Request failed!')
                }
    
                let body = await response.json();
    
                if((body.level === 'warning') || (body.level === 'error')) {
                    setRenderContent(false)
                    setAlertMessage(body)
                } else {
                    dataCallback(body)
                }
            }
        } catch (err) {
            setRenderContent(false)
            setAlertMessage(err)
        }
    }, [])
    
    return { alertMessage, renderContent, fetchData }

}