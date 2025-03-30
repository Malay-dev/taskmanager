function TaskItem({ task, provided }) {
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  return (
    <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
      <div>{task.title}</div>
      {formattedDueDate && (
        <div>Due: {formattedDueDate}</div>
      )}
    </li>
  );
}
export default TaskItem;