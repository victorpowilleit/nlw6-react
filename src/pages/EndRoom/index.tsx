import {useHistory} from "react-router-dom";

export function EndRoom() {
    const history = useHistory()
    setTimeout(()=>{history.push('/')}, 5000)
    return(
        <>
            <h1>Essa sala foi finalizada!</h1>
        </>
    )
}