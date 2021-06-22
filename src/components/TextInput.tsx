import { useContext, useEffect, useState } from "react";

export function TextInput(){
  
  const [myInput, setMyInput] = useState('')
  useEffect(()=>{setMyInput('Victor Powilleit')}, [])
  function handleInput(key: string){
    setMyInput(key)
  }
  return(
    <input type="text" value={myInput} onChange={(e)=>{ handleInput(e.target.value)}}/>
  )
}