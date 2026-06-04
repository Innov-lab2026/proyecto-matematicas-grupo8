import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/index.jsx';
import Layout from './layouts/layout.jsx';

function App() {
    return (
        <AuthProvider>
            <Layout>
                <AppRouter />
            </Layout>
        </AuthProvider>
    );
}

export default App;
