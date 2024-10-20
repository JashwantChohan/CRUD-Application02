import { useState, useEffect } from 'react'
import axios from 'axios'

const PORT = 5000

function App() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await axios.get(`http://localhost:${PORT}/items`)
      setItems(response.data)
    } catch (error) {
      console.log("Error fetching items", error)
    }
  }

  const addItem = async () => {
    const newItem = { name, description }
    try {
      const response = await axios.post(`http://localhost:${PORT}/items`, newItem)
      setItems([...items, response.data])
      setName('')
      setDescription('')
    } catch (error) {
      console.log("error ading item", error)
    }
  }

  const editItem = async () => {
    const updateItem = { name, description }
    try {
      const response = await axios.put(`http://localhost:${PORT}/items/${editingItem}`, updateItem)
      setItems(items.map(item => (item._id === editingItem ? response.data : item)))
      setEditingItem(null)
      setName('')
      setDescription('')
    } catch (error) {
      console.log('Error editing item:', error)
    }
  }

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:${PORT}/items/${id}`)
      const updateItem = items.filter((item) => item._id !== id)
      setItems(updateItem)
    } catch (error) {
      console.log('error deleting item:', error)
    }
  }

  return (
    <>
      <div className='flex justify-center items-center border-2 p-0 m-20 rounded-md shadow-2xl bg-slate-400'>
        <div className='App  '>
          <h1 className='text-5xl flex justify-center font-bold text-white mt-9'>CRUD with MERN Stack</h1>
          <div className='flex justify-center m-5 p-8'>
            <input type="text"
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='px-2 py-1 rounded mx-4'
            />
            <input type="text"
              placeholder='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='px-2 py-1 rounded mr-4'
            />
            <button onClick={editingItem ? editItem : addItem} className='bg-green-900 hover:bg-green-600 text-white text-sm rounded-md px-3 py-2'>
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>

          </div>

          <ul className=' flex-col  justify-center items-center mb-4 '>
            {items.map(items => (
              <li key={items._id}  className=' flex justify-center border-2 border-black px-2 py-1 mb-0.5  text-base rounded 	'>
                {items.name} - {items.description}
                <button className='bg-blue-900 hover:bg-blue-700 text-white text-base rounded-md px-4 py-1 mx-3' onClick={() => {
                  setName(items.name) 
                  setDescription(items.description) 
                  setEditingItem(items._id)
                  
                }}> Edit</button> 

                <button type='button' onClick={() => deleteItem(items._id)} className='bg-red-500 hover:bg-red-700 text-white text-base rounded-md px-4 py-1 '  >Delete</button>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </>
  )
}

export default App
