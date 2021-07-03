import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { database } from '../../services/firebase'

import { Button } from '../../components/Button'

import logoImg from '../../assets/images/logo.svg'
import illustrationImg from '../../assets/images/illustration.svg'
import googleIconImg from '../../assets/images/google-icon.svg'

import '../../styles/auth.scss'


export function Home() {

  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('')

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle()
    }
    if (user) {
      const existingRoom = await database.ref(`rooms`).orderByChild('authorId').equalTo(user.id).once('value')?.then(res=>res.val())
      const existingRoomCode = Object.keys(existingRoom || {})[0]
      //console.log(existingRoomCode)
        if (existingRoomCode) {
          history.push(`/admin/rooms/${existingRoomCode}`)
        }else{
      history.push('/rooms/new')
    }}
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()
    if (roomCode.trim() === '') { return }
    const roomRef = await database.ref(`rooms/${roomCode}`).get();
    if (!roomRef.exists()) {
      alert("A sala que você procura não existe")
      return
    }

    if (roomRef.val().endedAt) {
      alert('Esta sala já foi fechada')
      return
    }

    history.push(`/rooms/${roomCode}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo do google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )

}