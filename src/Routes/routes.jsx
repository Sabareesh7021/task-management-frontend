import { Route } from "react-router-dom";
import UsersView from "../View/UserView";
import ProfileView from "../View/ProfileView";
import TasksView from "../View/TaskView";

const superAdminRoutes = [
  <Route key="users" path="/admin/users" element={<UsersView />} />,
  <Route key="user-form" path="/admin/users/form/:userId?" element={<UsersView />} />,
  <Route key="user-profile" path="/admin/users/profile" element={<ProfileView />} />,
  <Route key="task" path="/task" element={<TasksView />} />,
];

const adminRoutes = [
  <Route key="users" path="/admin/users" element={<UsersView />} />,
  <Route key="user-form" path="/admin/users/form" element={<UsersView />} />,
  <Route key="user-profile" path="/admin/users/profile" element={<ProfileView />} />,
  <Route key="task" path="/task" element={<TasksView />} />,
];

const userRoutes = [
  <Route key="user-profile" path="/admin/users/profile" element={<ProfileView />} />,
  <Route key="task" path="/task" element={<TasksView />} />,
];

export { adminRoutes, userRoutes, superAdminRoutes };