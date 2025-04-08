# Task Management Application

This project is a **Task Management Application** built using **React**, **Redux**, and **Webpack**. It allows users to manage their tasks efficiently by providing features like filtering, categorization, prioritization, search, drag-and-drop reordering, and due date management. The application is designed to be modular, responsive, and user-friendly.
---


Live Link - https://task-manager-neo.netlify.app/
Test credentials
Email: admin.test@gmail.com
Password: admin123

## Features

### Core Features

1. **Add, Remove, and Mark Tasks as Completed**

   - Users can add new tasks, delete existing ones, and mark tasks as completed or incomplete.

2. **Filtering Tasks**

   - Filter tasks based on their completion status:
     - Show all tasks.
     - Show only completed tasks.
     - Show only incomplete tasks.

3. **Task Categories**

   - Categorize tasks into different categories (e.g., Personal, Work, Groceries).
   - Add tasks to specific categories.
   - Filter tasks based on their categories.

4. **Task Priority**

   - Assign priority levels to tasks (High, Medium, Low).
   - Sort tasks based on their priority.

5. **Search**

   - Search for tasks by their title using a search bar.

6. **Drag and Drop**

   - Reorder tasks within the task list using drag-and-drop functionality.

7. **Due Dates**
   - Set due dates for tasks.
   - Highlight tasks with due dates.
   - Notify users about tasks approaching their due dates.
8. **User Authentication**

   - Multiple users can manage their own task lists by signing in.

9. **Responsive Design**

   - The application is fully responsive and works seamlessly across devices.

10. **Accessibility**

    - Designed with accessibility in mind to ensure usability for all users.

11. **Animations**

    - Smooth animations and visual cues enhance the user experience.

12. **Data Persistence**
    - Task data is persisted using local storage or a backend server.

---

## Tech Stack

- **Frontend**: React, Redux
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Drag-and-Drop**: DnD Kit
- **Date Management**: Date-fns
- **Icons**: Lucide React
- **Build Tool**: Webpack
- **Backend (Optional)**: Supabase (for user authentication and data persistence)

---

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/task-manager.git
   cd task-manager
   ```

2. Install dependencies
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser:
   ```bash
   http://localhost:3000
   ```

## Usage Instructions

### Adding Tasks:

Use the "Add Task" button to create a new task.
Fill in the task details, including title, description, category, priority, and due date.

### Filtering and Searching:

Use the filter dropdowns to filter tasks by status, category, or priority.
Use the search bar to find tasks by their title.

### Reordering Tasks:

Drag and drop tasks to reorder them within the list.

### Editing and Deleting Tasks:

Click on a task to edit its details.
Use the delete button to remove a task.

### User Authentication:

Sign in to manage your personalized task list.

## Folder Structure

```bash
src/
├── components/
├── pages/
├── redux/
├── lib/
├── assets/
├── App.tsx
├── main.tsx
```

## Future Enhancements

- Add notifications for overdue tasks.
- Implement advanced sorting and filtering options.
- Integrate a calendar view for task management.

Contact
For any questions or feedback, please contact through [email](malaykumar2003@gmail.com) or dm in X [@void_malayk](https://x.com/void_MalayK)
