import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
const NotFoundPage = () => {    
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <p className="mt-4 text-xl text-gray-600">Page Not Found</p>
            <Button variant='transparent' onClick={()=>navigate(-1)

            }>Go Back</Button>
            
        </div>
    );
}

export default NotFoundPage;