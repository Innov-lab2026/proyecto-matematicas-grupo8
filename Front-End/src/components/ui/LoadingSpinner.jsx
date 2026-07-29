// src/components/LoadingSpinner.jsx
const LoadingSpinner = ({ message = "Cargando..." }) => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
                <p className="text-white mt-4">{message}</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;