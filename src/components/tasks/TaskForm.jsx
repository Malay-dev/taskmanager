import { useDispatch } from 'react-redux';
import { add } from '../../reducers/tasks'; // Assuming tasks reducer is in ../../reducers/tasks.js
import { useState } from 'react';

const TaskForm = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch(add({ title, completed: false, category, priority, dueDate }));
      setDueDate(null)
      setTitle("");
      setCategory("");
      setPriority("low");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input type="date" value={dueDate || ''} onChange={(e) => setDueDate(e.target.value)} />
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Enter task category"/>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title"
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;