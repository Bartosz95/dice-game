import { useState, useCallback } from 'react';
import { useKeycloak } from '@react-keycloak/web'

export default () => {
    const [ alertMessage, setAlertMessage] = useState(null)
    const [ renderContent, setRenderContent] = useState(false)
    const { keycloak } = useKeycloak()
    
    const fetchData = useCallback(async (requestOptions, dataCallback) => {
        
        setRenderContent(false)
        setAlertMessage(null)
        console.log("fetch")
        
        try {
            if(keycloak.authenticated) {
                const response = await fetch(
                    requestOptions.url, {
                    method: requestOptions.method || 'GET',
                    headers: {
                        ...requestOptions.headers || null,
                        'Authorization': `Bearer ${keycloak.token}`,
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
                    setRenderContent(true)
                }
            }
        } catch (err) {
            setRenderContent(false)
            setAlertMessage(err)
        }
    }, [keycloak])
    
    return { alertMessage, renderContent, fetchData }

}