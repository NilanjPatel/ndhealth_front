// useAuthVerification.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_PATH from '../../apiConfig';

const useAuthVerification = () => {
    const [isAuthenticated, setIsAuthenticated] = useState();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(`${API_BASE_PATH}/user-info/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                if (response.status === 200) {
                    setIsAuthenticated(response.data);
                }
                else {
                    setIsAuthenticated(false);
                }

            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        if (token) {
            verifyToken();
        } else {
            setIsAuthenticated(false);
        }
    }, [token]);

    return isAuthenticated;
};

export default useAuthVerification;
