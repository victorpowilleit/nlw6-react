// import { FormEvent, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
// import { useAuth } from '../../hooks/useAuth'
import { database } from '../../services/firebase'

import { Button } from '../../components/Button'
import { RoomCode } from '../../components/RoomCode'

import deleteImg from '../../assets/images/delete.svg'
import checkImg from '../../assets/images/check.svg'
import answerImg from '../../assets/images/answer.svg'

import './styles.scss'
import { Question } from '../../components/Question'
import { useRoom } from '../../hooks/useRoom'
import { LogoBtn } from '../../components/LogoBtn'


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

  async function handleCheckQuestionAsAnswered(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({isAnswered: true})
  }

  async function handleHighlightQuestion(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({isHighlighted: true})
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
            <LogoBtn />
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
              <Question key={question.id} content={question.content} author={question.author} isAnswered={question.isAnswered} isHighlighted={question.isHighlighted}>
                {!question.isAnswered&&<>
                <button type="button" onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                  <img src={checkImg} alt="Marcar pergunta como Respondida" />
                </button>
                {!question.isHighlighted&&<button type="button" onClick={() => handleHighlightQuestion(question.id)}>
                  <img src={answerImg} alt="Dar destaque à Pergunta" />
                </button>}
                </>}
                <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
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