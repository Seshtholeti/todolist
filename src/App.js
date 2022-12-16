import logo from './logo.svg';
import './App.css';


import {useState} from "react";
import TodoList from './TodoList';

function App() {
const [task,setTask] = useState("");
const[list,setList] = useState([]);

const onChangeHandler = e =>{
  setTask(e.target.value)
}

const onSubmitHandler = e=>{
  e.preventDefault();
  const newList = [...list,task];
  setList(newList);
  setTask("");
}

const deleteHandler = (index)=>{
  const newList = list.filter((li,i) => i !== index)
  setList(newList);

}

  return (
    <div className="App">
      <div className='card'>
        <div className='card-container'>
          <h2 className='title'>To Do ManageMent List</h2>
          <form onSubmit={onSubmitHandler}>
          <input type="text" name="task"  value={task} onChange={onChangeHandler} placeholder="enter the todo's here..." className='input-box' ></input>
          &nbsp;  &nbsp; 
          <input type="submit" value="add" name="add" className='btn-inp'></input>
          </form>
          <TodoList list={list}  deleteHandler ={deleteHandler}/>
        </div>

      </div>
    </div>
  );
}

export default App;
