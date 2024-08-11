import './GuessTheWord.css';
import { Button, Form, Modal } from "react-bootstrap"
import React, {useState, useEffect} from 'react';

function GuessTheWord() {

  const [hiddenWord, setHiddenWord] = useState("")
  const [guess, setGuess] = useState("")
  const [guessCount, setGuessCount] = useState(1)
  const [g1, setG1] = useState([])
  const [g2, setG2] = useState([]) 
  const [g3, setG3] = useState([])
  const [g4, setG4] = useState([])
  const [g5, setG5] = useState([])
  const [g6, setG6] = useState([])
  const [show, setShow] = useState(false)
  const [showLost, setShowLost] = useState(false)

  const fetchRandomWord = async () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const randomLetter = characters.charAt(Math.floor(Math.random() * characters.length))
    try {
      const response = await fetch(`https://api.datamuse.com/words?sp=??${randomLetter}??&max=1`, {
        method: 'GET'
      });
      const data = await response.json();
      const word = data[0].word;
      const stringWord = String(word)
      let seen = {}
      for (let char of stringWord) {
        if (seen[char]) {
          return fetchRandomWord()
        }
        seen[char] = true
      }
      return setHiddenWord(stringWord.toUpperCase());


    } catch (error) {
      console.error('Error fetching word:', error);
    }
  };

  useEffect(() => {
    fetchRandomWord();
  }, []);

  const handleGuess = (event) => {
    event.preventDefault();
    console.log(hiddenWord)
    let result = []
    let positionSeen = []
    for(let i = 0; i < 5; i++) {
      if (hiddenWord.charAt(i).toUpperCase() === guess.charAt(i).toUpperCase()) {
        positionSeen.push(guess.charAt(i))
        result.push("correct")
      } else if (hiddenWord.toUpperCase().includes(guess.charAt(i).toUpperCase()) && !(positionSeen.includes(guess.charAt(i).toUpperCase()))) {
        positionSeen.push(guess.charAt(i))
        console.log(positionSeen)
        result.push("position")
        
      } else {
        result.push("wrong")
      }
    }
    const successArray = result.filter(item => item === "correct")
    const countOfSuccess = successArray.length
    if(countOfSuccess === 5) {
      setShow(true)
    }
    if(guessCount === 6 && countOfSuccess !== 5) {
      setShowLost(true)
    }
    console.log(result)
    generateButtons(result, guessCount)
    setGuess("")
  }

  const generateButtons = (result, guessCount) => {
    let buttons = []
    for (let i = 0; i < 5; i++) {
      buttons.push(
        <Button
          key={i}
          variant={result[i] === "correct" ? "success" : (result[i] === "position" ? "warning" : "outline-secondary")}
          className="LetterButton"
        >{guess.charAt(i).toUpperCase()}
        </Button>
      );
    }
    switch(guessCount) {
      case 1:
        setG1(buttons)
        break
      case 2:
        setG2(buttons)
        break
      case 3:
        setG3(buttons)
        break
      case 4:
        setG4(buttons)
        break
      case 5:
        setG5(buttons)
        break
      case 6:
        setG6(buttons)
        break
      default:
        break
    }
    const newGuessCount = guessCount + 1
    setGuessCount(newGuessCount)
     return
  }

  const emptyButtons = () => {
    let buttons = []
    for (let i = 0; i < 5; i++) {
      buttons.push(
        <Button
          key={i}
          variant="outline-secondary"
          className="LetterButton"
        >
        </Button>
      )
    }
    return buttons
  }

  const handleNewGame = () => {
    window.location.reload()
  }

  return (
    <div className="GuessTheWord">
      <h1>Guess the word!</h1>
      {/*{hiddenWord}*/}
        <div>
          {g1.length === 0 ? (emptyButtons()):(g1)}
          <br />
          {g2.length === 0 ? (emptyButtons()):(g2)}
          <br />
          {g3.length === 0 ? (emptyButtons()):(g3)}
          <br />
          {g4.length === 0 ? (emptyButtons()):(g4)}
          <br />
          {g5.length === 0 ? (emptyButtons()):(g5)}
          <br />
          {g6.length === 0 ? (emptyButtons()):(g6)}
        </div>
        <div className="FormContainer">
        <Form className="Form">
          <Form.Control autoFocus type="text" maxLength={5} value={guess.toUpperCase()} onChange={(e) => setGuess(e.target.value)}/>
          <Button variant="success" type="submit" className="SubmitButton" onClick={handleGuess} disabled={!(guess.length === 5)}>Send</Button>
        </Form>
        </div>
        <Modal show={show} centered className="Modal" data-bs-theme="dark">
            <Modal.Header>
              <Modal.Title>You won!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>The word was {hiddenWord}</h4>
              <p>Score {8-guessCount}/6</p>
              </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleNewGame}>New game</Button>
            </Modal.Footer>
          </Modal>
          <Modal show={showLost} centered className="Modal" data-bs-theme="dark">
            <Modal.Header>
              <Modal.Title>You lost!</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button variant="danger" onClick={handleNewGame}>Restart</Button>
            </Modal.Footer>
          </Modal>
          <BackButton />
    </div>
  )
}

export default GuessTheWord;