import { useState, useEffect } from 'react';

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onLogin(result.sessionId);
      } else {
        setError(result.message || 'كلمة المرور غير صحيحة');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('حدث خطأ في الاتصال، يرجى المحاولة لاحقاً');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>🔐 لوحة التحكم الإدارية</h2>
          <p>سجل الدخول لإدارة السائقين</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <>
                <span>🔑</span>
                <span>تسجيل الدخول</span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>كلمة المرور الافتراضية: admin123</p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
