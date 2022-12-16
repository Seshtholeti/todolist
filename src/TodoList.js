import React from "react";
import css from "./TodoList.css"


const TodoList = ({list,deleteHandler}) =>{
    return(
        <div >
            {list.map((li,index)=>
             <div key={index}>
                <h3>{li} &nbsp; <button className="btn" onClick={()=> deleteHandler(index)}>Delete</button> </h3>
            </div>)}

        </div>
    )
      



}

export default TodoList;

