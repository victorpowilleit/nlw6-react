import { useHistory } from 'react-router-dom'
import logoImg from '../../assets/images/logo.svg'


export function LogoBtn() {
  const history = useHistory()
  return (
    <>
      <img src={logoImg} alt="Letmeask" onClick={() => history.push('/')} style={{cursor: 'pointer'}} />
    </>
  )
}