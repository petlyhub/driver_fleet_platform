import { useState } from 'react';

const cities = ['الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الخبر', 'الطائف', 'أبها', 'القصيم', 'تبوك'];
const vehicleTypes = ['سيارة', 'دباب', 'فان', 'شاحنة صغيرة'];

function DriverForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationalId: '',
    city: '',
    region: '',
    district: '',
    vehicleType: '',
    vehicleModel: '',
    vehiclePlateNumber: '',
    vehicleYear: new Date().getFullYear()
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'الاسم الكامل مطلوب';
        if (value.trim().length < 3) return 'الاسم يجب أن يكون 3 أحرف على الأقل';
        break;
      case 'email':
        if (!value.trim()) return 'البريد الإلكتروني مطلوب';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'البريد الإلكتروني غير صحيح';
        break;
      case 'phone':
        if (!value.trim()) return 'رقم الجوال مطلوب';
        if (!/^05\d{8}$/.test(value)) return 'رقم الجوال يجب أن يكون بصيغة 05xxxxxxxx';
        break;
      case 'nationalId':
        if (!value.trim()) return 'رقم الهوية مطلوب';
        if (!/^\d{10}$/.test(value)) return 'رقم الهوية يجب أن يكون 10 أرقام';
        break;
      case 'city':
        if (!value) return 'المدينة مطلوبة';
        break;
      case 'region':
        if (!value.trim()) return 'المنطقة مطلوبة';
        break;
      case 'vehicleType':
        if (!value) return 'نوع المركبة مطلوب';
        break;
      case 'vehicleModel':
        if (!value.trim()) return 'موديل المركبة مطلوب';
        break;
      case 'vehiclePlateNumber':
        if (!value.trim()) return 'رقم اللوحة مطلوب';
        break;
      case 'vehicleYear':
        if (!value || value < 2000 || value > new Date().getFullYear() + 1) 
          return `سنة الصنع يجب أن تكون بين 2000 و ${new Date().getFullYear() + 1}`;
        break;
      default:
        break;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/drivers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onSuccess();
      } else {
        setSubmitError(result.message || 'حدث خطأ أثناء التسجيل');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('حدث خطأ في الاتصال، يرجى المحاولة لاحقاً');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      {/* الاسم الكامل */}
      <div className="form-group">
        <label className="form-label">
          الاسم الكامل <span className="required">*</span>
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={`form-input ${errors.fullName ? 'error' : ''}`}
          placeholder="محمد أحمد محمد"
        />
        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
      </div>

      {/* رقم الهوية */}
      <div className="form-group">
        <label className="form-label">
          رقم الهوية <span className="required">*</span>
        </label>
        <input
          type="text"
          name="nationalId"
          value={formData.nationalId}
          onChange={handleChange}
          className={`form-input ${errors.nationalId ? 'error' : ''}`}
          placeholder="10XXXXXXXX"
          maxLength="10"
          onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
        />
        {errors.nationalId && <span className="error-message">{errors.nationalId}</span>}
      </div>

      {/* البريد الإلكتروني */}
      <div className="form-group">
        <label className="form-label">
          البريد الإلكتروني <span className="required">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder="example@email.com"
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      {/* رقم الجوال */}
      <div className="form-group">
        <label className="form-label">
          رقم الجوال <span className="required">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`form-input ${errors.phone ? 'error' : ''}`}
          placeholder="05XXXXXXXX"
          maxLength="10"
          onInput={(e) => e.target.value = e.target.value.replace(/[^\d]/g, '')}
        />
        {errors.phone && <span className="error-message">{errors.phone}</span>}
      </div>

      {/* المدينة */}
      <div className="form-group">
        <label className="form-label">
          المدينة <span className="required">*</span>
        </label>
        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          className={`form-select ${errors.city ? 'error' : ''}`}
        >
          <option value="">اختر المدينة</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        {errors.city && <span className="error-message">{errors.city}</span>}
      </div>

      {/* المنطقة */}
      <div className="form-group">
        <label className="form-label">
          المنطقة <span className="required">*</span>
        </label>
        <input
          type="text"
          name="region"
          value={formData.region}
          onChange={handleChange}
          className={`form-input ${errors.region ? 'error' : ''}`}
          placeholder="مثال: شمال الرياض"
        />
        {errors.region && <span className="error-message">{errors.region}</span>}
      </div>

      {/* الحي */}
      <div className="form-group">
        <label className="form-label">الحي</label>
        <input
          type="text"
          name="district"
          value={formData.district}
          onChange={handleChange}
          className="form-input"
          placeholder="مثال: الملقا"
        />
      </div>

      {/* نوع المركبة */}
      <div className="form-group">
        <label className="form-label">
          نوع المركبة <span className="required">*</span>
        </label>
        <select
          name="vehicleType"
          value={formData.vehicleType}
          onChange={handleChange}
          className={`form-select ${errors.vehicleType ? 'error' : ''}`}
        >
          <option value="">اختر نوع المركبة</option>
          {vehicleTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.vehicleType && <span className="error-message">{errors.vehicleType}</span>}
      </div>

      {/* موديل المركبة */}
      <div className="form-group">
        <label className="form-label">
          موديل المركبة <span className="required">*</span>
        </label>
        <input
          type="text"
          name="vehicleModel"
          value={formData.vehicleModel}
          onChange={handleChange}
          className={`form-input ${errors.vehicleModel ? 'error' : ''}`}
          placeholder="مثال: تويوتا كامري"
        />
        {errors.vehicleModel && <span className="error-message">{errors.vehicleModel}</span>}
      </div>

      {/* رقم اللوحة */}
      <div className="form-group">
        <label className="form-label">
          رقم اللوحة <span className="required">*</span>
        </label>
        <input
          type="text"
          name="vehiclePlateNumber"
          value={formData.vehiclePlateNumber}
          onChange={handleChange}
          className={`form-input ${errors.vehiclePlateNumber ? 'error' : ''}`}
          placeholder="مثال: أ ب ج 1234"
        />
        {errors.vehiclePlateNumber && <span className="error-message">{errors.vehiclePlateNumber}</span>}
      </div>

      {/* سنة الصنع */}
      <div className="form-group">
        <label className="form-label">
          سنة الصنع <span className="required">*</span>
        </label>
        <select
          name="vehicleYear"
          value={formData.vehicleYear}
          onChange={handleChange}
          className={`form-select ${errors.vehicleYear ? 'error' : ''}`}
        >
          <option value="">اختر السنة</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        {errors.vehicleYear && <span className="error-message">{errors.vehicleYear}</span>}
      </div>

      {/* رسالة الخطأ العامة */}
      {submitError && (
        <div className="form-group full-width">
          <div className="alert alert-error">
            <span>⚠️</span>
            <span>{submitError}</span>
          </div>
        </div>
      )}

      {/* زر الإرسال */}
      <div className="form-group full-width">
        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              <span>جاري الإرسال...</span>
            </>
          ) : (
            <>
              <span>📝</span>
              <span>إرسال طلب التسجيل</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default DriverForm;
