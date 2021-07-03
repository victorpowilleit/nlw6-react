import { useEffect, useState } from 'react'
import { database } from '../services/firebase'
import { useAuth } from './useAuth'
import {useHistory} from "react-router-dom";

type QuestionType = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likeCount: number
  likeId: string | undefined
  // hasLiked: boolean
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likes: Record<string, {
    authorId: string
  }>
}>

export function useRoom(roomId: string) {
  const history = useHistory()
  const {user} = useAuth()
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')
  const [endedAt, setEndedAt] = useState(null)

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)
    roomRef.on('value', room => {
      try{


      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
          // hasLiked: Object.values(value.likes ?? {}).some(like => like.authorId === user?.id)
        }
      })
      setTitle(databaseRoom.title)
      setEndedAt(databaseRoom.endedAt)
      setQuestions(parsedQuestions)
    }catch(e){
        history.push('/endroom')
      }})
    return ()=>{roomRef.off()}
  }, [roomId, user?.id, history])

  return {questions, title, endedAt}
}