import { useState } from 'react'
import { Square } from './components/Square.jsx'
import { TURNS } from './constants.js'
import { checkWinnerFrom, checkEndGame } from './logic/board.js'
import { WinnerModal } from './components/WinnerModal.jsx'
import { saveGameToStorage, resetGameStorage } from './logic/storage/index.js'

function App () {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })

  // null es que no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(null)
  const[contador, setContador]=useState(() =>{
    const contadorFromStorage = window.localStorage.getItem('contador')
    if (contadorFromStorage) return JSON.parse(contadorFromStorage)
    return [0,0]
  })

  const resetGame = (clearContador = false) => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    resetGameStorage(clearContador)
    if(clearContador=== true)
      setContador([0,0])
  }

  const updateBoard = (index) => {
    // no actualizamos esta posición
    // si ya tiene algo
    if (board[index] || winner) return
    // actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    // cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // revisar si hay ganador
    const newContador = [...contador]
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      setWinner(newWinner)
      if(newWinner===TURNS.X){
        newContador[0]++
      }else{
        newContador[1]++
      }
      setContador(newContador)
    } else if (checkEndGame(newBoard)) {
      setWinner(false) // empate
    }
    // guardar aqui partida
    saveGameToStorage({
      board: newBoard,
      turn: newTurn,
      contador: newContador
    })
  }

  const handleClick = ()=>{
    resetGame(true)
  }

  return (
    <main className='board'>
      <h1 className='text'>Tres en ralla</h1>
      <button onClick={handleClick}>Empezamos de nuevo</button>
      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <p className='text'>{contador[0]}-{contador[1]}</p>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default App
