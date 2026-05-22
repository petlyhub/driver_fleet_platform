import { useState } from 'react';
import DriverForm from './components/DriverForm';
import SuccessMessage from './components/SuccessMessage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  
  const handleSuccess = () => {
    setShowSuccess(true);
  };
  
  const handleReset = () => {
    setShowSuccess(false);
  };

  const handleAdminLogin = (sessionId) => {
    setSessionId(sessionId);
    setIsAdminMode(true);
  };

  const handleAdminLogout = () => {
    setSessionId(null);
    setIsAdminMode(false);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>🚚 عالم التوصيل السريع</h1>
            <p>اللوجستية - Driver Fleet Platform</p>
          </div>
          {!isAdminMode && (
            <button onClick={() => setIsAdminMode(true)} className="admin-link-btn">
              🔐 دخول الإدارة
            </button>
          )}
        </div>
      </header>

      {isAdminMode ? (
        !sessionId ? (
          <AdminLogin onLogin={handleAdminLogin} />
        ) : (
          <AdminDashboard sessionId={sessionId} onLogout={handleAdminLogout} />
        )
      ) : (
        <>
          {/* Hero Section */}
          <section className="hero">
            <h2>انضم إلى أسطولنا من السائقين</h2>
            <p>سجل الآن وانضم إلى أكبر منصة توصيل في المملكة العربية السعودية</p>
            
            <div className="features">
              <div className="feature-item">
                <span className="feature-icon">💰</span>
                <span>دخل مجزي</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⏰</span>
                <span>مرونة في الوقت</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🛡️</span>
                <span>تأمين شامل</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <span>تطبيق سهل الاستخدام</span>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <main className="main-content">
            <div className="form-container">
              <h2 className="form-title">نموذج تسجيل السائقين</h2>
              <p className="form-subtitle">
                املأ النموذج أدناه للانضمام إلى أسطولنا. جميع الحقول المطلوبة مشار إليها بـ (*)
              </p>

              {showSuccess ? (
                <SuccessMessage onReset={handleReset} />
              ) : (
                <DriverForm onSuccess={handleSuccess} />
              )}
            </div>
          </main>

          {/* Footer */}
          <footer className="footer">
            <p>© {new Date().getFullYear()} عالم التوصيل السريع اللوجستية. جميع الحقوق محفوظة.</p>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
