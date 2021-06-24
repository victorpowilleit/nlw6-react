import { auth } from "../../services/firebase"
import { useHistory } from 'react-router-dom'

export function LogOut(){
  const history = useHistory()
  auth.signOut().then(()=>history.push('/'))
  return(
    <h1>LOGOUT</h1>
  )
}