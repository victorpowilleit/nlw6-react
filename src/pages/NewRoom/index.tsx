import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { database } from '../../services/firebase'

import { Button } from '../../components/Button'

import logoImg from '../../assets/images/logo.svg'
import illustrationImg from '../../assets/images/illustration.svg'

import '../../styles/auth.scss'

export function NewRoom() {

  const history = useHistory()
  const [newRoom, setNewRoom] = useState<string>('')

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault()
    if (newRoom?.trim() === ''){
      return
    }
    const roomRef = database.ref('rooms')
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
      authorAvatar: user?.avatar
    })
    history.push(`/admin/rooms/${firebaseRoom.key}`)
  }

  const { user } = useAuth()

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
          <h1>{user?.name}</h1>
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>Quer entrar numa sala já existente? <Link to="/">Clique aqui</Link></p>
        </div>
      </main>
    </div>
  )

}