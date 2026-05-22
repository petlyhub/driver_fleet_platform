import { useState, useEffect } from 'react';

function AdminDashboard({ sessionId, onLogout }) {
  const [drivers, setDrivers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [driversRes, statsRes] = await Promise.all([
        fetch('/api/drivers', {
          headers: { 'x-session-id': sessionId }
        }),
        fetch('/api/admin/stats', {
          headers: { 'x-session-id': sessionId }
        })
      ]);

      const driversData = await driversRes.json();
      const statsData = await statsRes.json();

      if (driversData.success && statsData.success) {
        setDrivers(driversData.data);
        setStats(statsData.data);
      } else {
        setError('فشل تحميل البيانات');
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (driverId, newStatus) => {
    try {
      const response = await fetch(`/api/drivers/${driverId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setDrivers(prev => prev.map(d => 
          d._id === driverId ? { ...d, status: newStatus } : d
        ));
        
        // Reload stats
        const statsRes = await fetch('/api/admin/stats', {
          headers: { 'x-session-id': sessionId }
        });
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      } else {
        setError(result.message || 'فشل تحديث الحالة');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('حدث خطأ أثناء تحديث الحالة');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'x-session-id': sessionId }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    onLogout();
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'قيد المراجعة', class: 'badge-pending' },
      under_review: { text: 'تحت المراجعة', class: 'badge-review' },
      approved: { text: 'مقبول', class: 'badge-approved' },
      rejected: { text: 'مرفوض', class: 'badge-rejected' }
    };
    return badges[status] || badges.pending;
  };

  const filteredDrivers = filter === 'all' 
    ? drivers 
    : drivers.filter(d => d.status === filter);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-large"></div>
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h2>📊 لوحة التحكم - إدارة السائقين</h2>
        <button onClick={handleLogout} className="logout-btn">
          <span>🚪</span>
          <span>تسجيل الخروج</span>
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalDrivers}</h3>
              <p>إجمالي السائقين</p>
            </div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pendingCount}</h3>
              <p>قيد المراجعة</p>
            </div>
          </div>
          <div className="stat-card stat-approved">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.approvedCount}</h3>
              <p>مقبول</p>
            </div>
          </div>
          <div className="stat-card stat-rejected">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <h3>{stats.rejectedCount}</h3>
              <p>مرفوض</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError('')} className="close-alert">×</button>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar">
        <h3>قائمة السائقين</h3>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            الكل ({drivers.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            قيد المراجعة ({stats?.pendingCount || 0})
          </button>
          <button 
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            المقبولون ({stats?.approvedCount || 0})
          </button>
          <button 
            className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            المرفوضون ({stats?.rejectedCount || 0})
          </button>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="drivers-table-container">
        <table className="drivers-table">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>الجوال</th>
              <th>المدينة</th>
              <th>نوع المركبة</th>
              <th>تاريخ التسجيل</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">لا يوجد سائقين لعرضهم</td>
              </tr>
            ) : (
              filteredDrivers.map(driver => {
                const badge = getStatusBadge(driver.status);
                return (
                  <tr key={driver._id}>
                    <td>{driver.fullName}</td>
                    <td>{driver.email}</td>
                    <td>{driver.phone}</td>
                    <td>{driver.city}</td>
                    <td>{driver.vehicleType}</td>
                    <td>{new Date(driver.createdAt).toLocaleDateString('ar-SA')}</td>
                    <td>
                      <span className={`status-badge ${badge.class}`}>
                        {badge.text}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {driver.status !== 'approved' && (
                          <button 
                            className="btn-approve"
                            onClick={() => handleStatusChange(driver._id, 'approved')}
                            title="قبول"
                          >
                            ✓
                          </button>
                        )}
                        {driver.status !== 'rejected' && (
                          <button 
                            className="btn-reject"
                            onClick={() => handleStatusChange(driver._id, 'rejected')}
                            title="رفض"
                          >
                            ✗
                          </button>
                        )}
                        {driver.status === 'pending' && (
                          <button 
                            className="btn-review"
                            onClick={() => handleStatusChange(driver._id, 'under_review')}
                            title="تحت المراجعة"
                          >
                            👁
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
