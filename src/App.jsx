import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./View/Login";
import { superAdminRoutes, adminRoutes, userRoutes } from "./Routes/routes";
import MainLayout from "./Layouts/MainLayout";

const routeMap = {
  super_admin: {
    routes: superAdminRoutes,
    defaultRoute: "/admin/users",
  },
  admin: {
    routes: adminRoutes,
    defaultRoute: "/admin/users",
  },
  user: {
    routes: userRoutes,
    defaultRoute: "/task",
  },
};

function App() {
  const userRole = localStorage.getItem("role");
  console.log("User Role:", userRole);

  if (!userRole || !routeMap[userRole]) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  const isRouteAllowed = (path) => {
    if (path === "/login") return true;

    const allowedRoutes = routeMap[userRole].routes.map(
      (route) => route.props.path
    );
    return allowedRoutes.some(
      (route) => path === route || path.startsWith(route + "/")
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect /login if already logged in */}
        <Route path="/login" element={<Navigate replace to={routeMap[userRole].defaultRoute} />} />

        {/* Wrap all role routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          {routeMap[userRole].routes}
        </Route>

        {/* Catch-all */}
        <Route
          path="*"
          element={
            isRouteAllowed(window.location.pathname) ? (
              <Navigate replace to={routeMap[userRole].defaultRoute} />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
