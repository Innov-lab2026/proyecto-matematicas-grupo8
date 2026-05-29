import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TestValidation from './pages/TestValidation';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/test-validation" element={<TestValidation />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
