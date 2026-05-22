function SuccessMessage({ onReset }) {
  return (
    <div className="success-container">
      <div className="success-icon">✓</div>
      <h3 className="success-title">تم التسجيل بنجاح!</h3>
      <p className="success-message">
        تم استلام طلبك وسنقوم بمراجعته في أقرب وقت. سيتم التواصل معك عبر البريد الإلكتروني أو الجوال عند تحديث حالة الطلب.
      </p>
      <button onClick={onReset} className="back-btn">
        ← تسجيل سائق آخر
      </button>
    </div>
  );
}

export default SuccessMessage;
