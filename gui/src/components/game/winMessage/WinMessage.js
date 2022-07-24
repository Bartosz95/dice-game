import React from "react"
import { Modal } from 'react-bootstrap';
import './WinMessage.css'

export default props => {
    const players = props.elems
    let winnersId = [];
    let score = 0
    players.forEach(player => {
        if (player.table.total > score) {
            winnersId = [player.id]
            score = player.table.total
        } else if (player.table.total === score) {
            winnersId.push(player.id)
        }
    })
    
    return <Modal.Dialog bg="success">
                <Modal.Header >
                    <Modal.Title>CONGRATULATIONS !</Modal.Title>
                </Modal.Header>
            
                <Modal.Body>
                    <p>Game is over. {winnersId.length > 1 ? 'Players' : 'Player'} {winnersId.toString().replaceAll(',',', ')} won !!!</p>
                </Modal.Body>
            </Modal.Dialog>
}