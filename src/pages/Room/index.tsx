import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { database } from '../../services/firebase'

import { Button } from '../../components/Button'
import { RoomCode } from '../../components/RoomCode'

import logoImg from '../../assets/images/logo.svg'

import './styles.scss'
import { Question } from '../../components/Question'
import { useRoom } from '../../hooks/useRoom'


type RoomParams = {
  id: string
}

export function Room() {

  const [newQuestion, setNewQuestion] = useState('')
  const params = useParams<RoomParams>()
  const roomId = params.id
  const { user } = useAuth()
  const {title, questions} = useRoom(roomId)

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()

    if (newQuestion.trim() === '') { return; }
    if (!user) { throw new Error("Você deve estar logado para postar uma pergunta.") }
    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false
    }
    await database.ref(`rooms/${roomId}/questions`).push(question)
    setNewQuestion('')
  }

  return (
    <>
      <div id="page-room">
        <header>
          <div className="content">
            <img src={logoImg} alt="Letmeask" />
            <RoomCode code={roomId} />
          </div>
        </header>
        <main>
          <div className="room-title">
            <h1>Sala {title}</h1>
            {questions.length > 0 && <span>{questions.length} pergunta{questions.length > 1 && "s"}</span>}
          </div>
          <form onSubmit={handleSendQuestion}>
            <textarea
              placeholder="O que você quer perguntar"
              onChange={event => setNewQuestion(event.target.value)}
              value={newQuestion}
            />
            <div className="form-footer">
              {user ? (
                <div className="user-info">
                  <img src={user.avatar} alt={user.name} />
                  <span>{user.name}</span>
                </div>
              ) : (
                <span>Para enviar uma pergunta, <button>faça seu login.</button></span>
              )}
              <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
            </div>
          </form>
          <div className='question-list'>
            {questions.map(question => <Question key={question.id} content={question.content} author={question.author} />)}
            {/* {JSON.stringify(questions)} */}
          </div>
        </main>
      </div>
    </>
  )
}