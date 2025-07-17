import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './components/ui/Notification';
import AdminApp from './components/admin/AdminApp';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AdminApp />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
