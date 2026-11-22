// Tien ich dung chung cho cac cong HueIC
window.HueIC = {
  getSession() {
    try {
      return JSON.parse(localStorage.getItem('hueic_session') || 'null');
    } catch (e) {
      return null;
    }
  },
  setSession(user) {
    try {
      localStorage.setItem('hueic_session', JSON.stringify(user));
    } catch (e) {}
  },
  logout() {
    localStorage.removeItem('hueic_session');
    window.location.href = 'index.html';
  }
};
