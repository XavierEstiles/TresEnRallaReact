export const saveGameToStorage = ({ board, turn, contador }) => {
  // guardar aqui partida
  window.localStorage.setItem('board', JSON.stringify(board))
  window.localStorage.setItem('turn', turn)
  window.localStorage.setItem('contador', JSON.stringify(contador))
}

export const resetGameStorage = (clearContador) => {
  window.localStorage.removeItem('board')
  window.localStorage.removeItem('turn')
  if(clearContador=== true)
    window.localStorage.removeItem('contador')
}
