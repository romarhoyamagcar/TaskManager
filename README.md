# Construction Task Manager

A professional construction services task management web application built with React.js and Tailwind CSS. This application serves both construction team members (users) and project managers (admins) with efficient task management capabilities.

## Features

### User System
- **Secure Authentication**: User registration and login system
- **Profile Management**: Editable user profiles with contact information
- **Session Management**: Persistent login sessions using localStorage

### Task Management
- **Create Tasks**: Add tasks with title, description, due date/time, and priority levels
- **Edit/Update Tasks**: Modify existing task details
- **Task Completion**: Mark tasks as complete/incomplete with visual indicators
- **Delete Tasks**: Remove tasks with confirmation dialogs
- **Priority Levels**: High, Medium, and Low priority with color-coded badges

### Search & Sort Features
- **Real-time Search**: Search across task titles and descriptions
- **Multiple Sort Options**: Sort by due date, priority, creation date, or completion status
- **Advanced Filtering**: Filter tasks by priority levels and completion status

### Admin System
- **Admin Authentication**: Separate admin login credentials
- **User Management**: View all registered users, their task lists, and delete users
- **Task Oversight**: View and manage all tasks across all users
- **Analytics Dashboard**: Overview of task distribution and user activity

### Technical Features
- **Responsive Design**: Mobile-first approach with breakpoints for all screen sizes
- **Data Persistence**: localStorage for offline data storage
- **Professional UI**: Construction-themed design with custom color palette
- **Accessibility**: WCAG compliant components where possible

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TaskManager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### User Login
- Regular users can register with any email and password
- After registration, users can create, edit, and manage their construction tasks

### Admin Login
- Email: `admin@hanover-tyke.com`
- Password: `admin123`
- Admins can view all users and tasks, delete users/tasks, and monitor activity

### Creating Tasks
1. Navigate to the Tasks page
2. Click "New Task" button
3. Fill in task details:
   - Title and description (required)
   - Due date and time (optional)
   - Priority level (High/Medium/Low)
4. Save the task

### Managing Tasks
- **Complete Tasks**: Click the checkmark icon to mark tasks as complete
- **Edit Tasks**: Click the pencil icon to modify task details
- **Delete Tasks**: Click the trash icon to remove tasks
- **Search Tasks**: Use the search bar to find specific tasks
- **Filter Tasks**: Apply filters for priority and completion status
- **Sort Tasks**: Use the sort dropdown to reorder tasks

## Project Structure

```
src/
├── components/
│   ├── Navbar.js           # Navigation component
│   ├── ProtectedRoute.js   # Route protection wrapper
│   └── TaskForm.js         # Task creation/editing form
├── context/
│   ├── AuthContext.js      # Authentication state management
│   ├── TaskContext.js      # Task state management
│   └── UserContext.js      # User state management
├── pages/
│   ├── Login.js           # User login page
│   ├── Register.js        # User registration page
│   ├── Dashboard.js       # User dashboard
│   ├── Tasks.js           # Task management page
│   ├── Profile.js         # User profile page
│   └── admin/
│       ├── AdminDashboard.js  # Admin overview
│       ├── AdminUsers.js      # User management
│       └── AdminTasks.js      # Task oversight
├── App.js                 # Main application component
├── index.css              # Global styles and Tailwind imports
└── index.js               # Application entry point
```

## Design System

### Color Palette
- **Construction Blue**: `#1e3a8a` (Primary brand color)
- **Hard Hat Yellow**: `#fbbf24` (Accent color)
- **Safety Orange**: `#f97316` (Warning/high priority)
- **Construction Green**: `#16a34a` (Success/completed)
- **Construction Red**: `#dc2626` (Danger/delete)
- **Concrete Gray**: Various shades for text and backgrounds

### Typography
- **Display Font**: Roboto (Headings and bold text)
- **Body Font**: Inter (Regular text and content)

### Components
- **Cards**: Consistent spacing and shadows for content sections
- **Buttons**: Primary, secondary, success, and danger variants
- **Badges**: Color-coded priority and status indicators
- **Forms**: Consistent input styling with validation states

## Technologies Used

- **React.js**: Frontend framework with functional components and hooks
- **React Router**: Client-side routing and navigation
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Heroicons**: Consistent icon library
- **localStorage**: Client-side data persistence

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository.

---

**Construction Task Manager**  
*Building Stronger Structures* 🏗️
