
import './App.css'
import TaskForm from './components/tasks/TaskForm';
import TaskList from './components/tasks/TaskList';
import TaskDashboard from './components/tasks/TaskDashboard';
import Header from './components/Header';
function App() {

  return (
    <>
      <Header></Header>
      <TaskDashboard/>
    </>
  )
}

export default App
