import React, {useState} from 'react'
import Person from "./Person";


const App = () => {
    const [persons, setPersons] = useState([
        {
            name: 'Arto Hellas',
            number: '0231-6187632'
        }
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const handleNameChange = (event) => {
        // console.log(event.target.value)
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        // console.log(event.target.value)
        setNewNumber(event.target.value)
    }

    const addPerson = (event) => {
        console.log(event.target.value)
        event.preventDefault()

        const newPerson = {
            name: newName,
            number: newNumber
        }

        if (persons.some(person => person.name === newName)) {
            window.alert(`${newName} is already added to phonebook`)
        } else {
            setPersons(persons.concat(newPerson))
        }

        setNewName('')
        setNewNumber('')
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <form onSubmit={addPerson}>
                <div>
                    name: <input value={newName} onChange={handleNameChange}/>
                </div>
                <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            {persons.map(p => <Person key={p.name} name={p.name} number={p.number}/>)}
        </div>
    )
}

export default App
