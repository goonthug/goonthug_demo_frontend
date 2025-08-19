import { Link, useNavigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useAuth } from "../context/AuthContext.jsx";

const Header = observer(() => {
  const { authStore } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authStore.logout();
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    if (path !== "/" && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  const getNavLinkClass = (path) => {
    const baseClass = "text-black hover:text-gray-700 transition-colors";
    const activeClass = "font-bold";
    return isActive(path) ? `${baseClass} ${activeClass}` : baseClass;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <span className="text-xl font-bold text-black">Game Tester</span>
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className={getNavLinkClass("/")}>
            Главная
          </Link>
          <Link to="/games" className={getNavLinkClass("/games")}>
            Игры
          </Link>
          {authStore.token && authStore.user?.role === "TESTER" && (
            <>
              <Link to="/feedback" className={getNavLinkClass("/feedback")}>
                Отзывы
              </Link>
              <Link to="/dashboard" className={getNavLinkClass("/dashboard")}>
                Профиль
              </Link>
            </>
          )}
          {authStore.token && authStore.user?.role === "COMPANY" && (
            <Link to="/company" className={getNavLinkClass("/company")}>
              Панель управления
            </Link>
          )}
          {authStore.token && authStore.user?.role === "ADMIN" && (
            <Link to="/admin" className={getNavLinkClass("/admin")}>
              Админ панель
            </Link>
          )}
        </nav>
        <div className="flex space-x-4">
          {authStore.token ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700 transition-colors"
            >
              Выйти
            </button>
          ) : (
            <>
              <Link to="/register">
                <button
                  type="button"
                  className="bg-red-600 text-white px-4 py-2 rounded-md font-bold hover:bg-red-700 transition-colors"
                >
                  Регистрация
                </button>
              </Link>
              <Link to="/login">
                <button
                  type="button"
                  className="bg-white border border-gray-300 text-red-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Вход
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
});

export default Header;
