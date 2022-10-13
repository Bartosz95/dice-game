import { Badge } from 'react-bootstrap';

export default props => <Badge 
    pill bg="light" 
    text="dark" 
    className="turnInfoDiv">
        <div className="numberOfRoll">Roll: {props.numberOfRoll}</div>
        <br/>
        <div className="turn" >Turn: {props.numberOfTurn}</div>
</Badge>