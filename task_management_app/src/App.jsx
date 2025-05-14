import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";
import Trash from "./pages/Trash";
import TaskDetails from "./pages/TaskDetails";
// import { Toaster } from "sooner";
function MainFrame() {
  const user = "";
  const location = useLocation();
  return user ? (
    <div>
      <div>{/* sidebar */}</div>
      {/* mobileside */}
      <div>{/* navi */}</div>
      <div>
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
function App() {
  return (
    <div>
      <Routes>
        <Route element={<MainFrame />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="completedTasks/:status" element={<Tasks />} />
          <Route path="inProgressTasks/:status" element={<Tasks />} />
          <Route path="todoTasks/:status" element={<Tasks />} />
          <Route path="users" element={<Users />} />
          <Route path="bin" element={<Trash />} />
          <Route path="TaskDetails/:id" element={<TaskDetails />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
      {/* <Toaster richColors /> */}
    </div>
  );
}

export default App;
