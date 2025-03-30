import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter, setCategoryFilter, setSortByPriority, setSearchQuery, reorderTasks } from '../../reducers/tasks'; // Adjust path as needed
import TaskItem from './TaskItem';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
const priorityOrder = { low: 0, medium: 1, high: 2 };
const TaskList = () => {
  const tasks = useSelector(state => state.tasks.tasks);
  const filter = useSelector(state => state.tasks.filter);
  const categoryFilter = useSelector(state => state.tasks.categoryFilter);
  const dispatch = useDispatch();
  const searchQuery = useSelector(state => state.tasks.searchQuery);

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination } = result;

        dispatch(reorderTasks({
            startIndex: source.index,
            endIndex: destination.index
        }));
    };
  const handleFilterChange = (event) => {
    dispatch(setFilter(event.target.value));
  };

  const handleCategoryFilterChange = (event) => {
    dispatch(setCategoryFilter(event.target.value));
  };

  const handleSortByPriorityChange = (event) => {
    dispatch(setSortByPriority(event.target.value));
  };
    const handleSearchQueryChange = (event) => {
        dispatch(setSearchQuery(event.target.value));
    };
  const sortByPriority = useSelector(state => state.tasks.sortByPriority);


    const existingCategories = [...new Set(tasks.map(task => task.category))];

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') {
        return task.completed && (categoryFilter === 'all' || task.category === categoryFilter);
    } else if (filter === 'incomplete') {
        return !task.completed && (categoryFilter === 'all' || task.category === categoryFilter);
    } else {
        return categoryFilter === 'all' || task.category === categoryFilter
    }
  }).filter(task => {
        return task.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const finalTasks = sortByPriority === "none" ? filteredTasks : [...filteredTasks].sort((a,b) => {
        if (sortByPriority === 'ascending') return priorityOrder[a.priority] - priorityOrder[b.priority];
        if (sortByPriority === 'descending') return priorityOrder[b.priority] - priorityOrder[a.priority];
        return 0;
    })




  return (
    <div>
        <select value={categoryFilter} onChange={handleCategoryFilterChange}>
            <option value="all">All</option>
            {existingCategories.map(category => (
                <option key={category} value={category}>{category}</option>
            ))}
        </select>
      <select value={filter} onChange={handleFilterChange}>
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
      </select>
        <select value={sortByPriority} onChange={handleSortByPriorityChange}>
            <option value="none">None</option>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
        </select>
        <input type="text" value={searchQuery} onChange={handleSearchQueryChange} placeholder="Search tasks" />
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="tasks">
            {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                    {finalTasks.map((task, index) => (
                        <Draggable key={task.title} draggableId={task.title} index={index}>
                            {(provided) => (
                                <TaskItem task={task} provided={provided} />
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </ul>
            )}
        </Droppable>
    </DragDropContext>
    </div>
);
};

export default TaskList;