// import { FormEvent, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
// import { useAuth } from '../../hooks/useAuth'
import { database } from '../../services/firebase'

import { Button } from '../../components/Button'
import { RoomCode } from '../../components/RoomCode'

import logoImg from '../../assets/images/logo.svg'
import deleteImg from '../../assets/images/delete.svg'

import './styles.scss'
import { Question } from '../../components/Question'
import { useRoom } from '../../hooks/useRoom'


type RoomParams = {
  id: string
}

export function AdminRoom() {

  // const [newQuestion, setNewQuestion] = useState('')
  const history = useHistory()
  const params = useParams<RoomParams>()
  const roomId = params.id
  // const { user } = useAuth()
  const { title, questions } = useRoom(roomId)

  async function handleEndRoom(){
    if(window.confirm('Tem certeza que deseja a sala?\r\nEssa ação não pode ser desfeita.')){
      await database.ref(`rooms/${roomId}`).update({endedAt: new Date()})
      history.push('/')
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Você tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  // async function handleSendQuestion(event: FormEvent) {
  //   event.preventDefault()

  //   if (newQuestion.trim() === '') { return; }
  //   if (!user) { throw new Error("Você deve estar logado para postar uma pergunta.") }
  //   const question = {
  //     content: newQuestion,
  //     author: {
  //       name: user.name,
  //       avatar: user.avatar,
  //     },
  //     isHighlighted: false,
  //     isAnswered: false
  //   }
  //   await database.ref(`rooms/${roomId}/questions`).push(question)
  //   setNewQuestion('')
  // }

  return (
    <>
      <div id="page-room">
        <header>
          <div className="content">
            <img src={logoImg} alt="Letmeask" />
            <div>
              <RoomCode code={roomId} />
              <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
            </div>
          </div>
        </header>
        <main>
          <div className="room-title">
            <h1>Sala {title}</h1>
            {questions.length > 0 && <span>{questions.length} pergunta{questions.length > 1 && "s"}</span>}
          </div>

          <div className='question-list'>
            {questions.map(question => (
              <Question key={question.id} content={question.content} author={question.author}>
                <button type="button" onClick={() => { handleDeleteQuestion(question.id) }}>
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            ))}
            {/* {JSON.stringify(questions)} */}
          </div>
        </main>
      </div>
    </>
  )
}