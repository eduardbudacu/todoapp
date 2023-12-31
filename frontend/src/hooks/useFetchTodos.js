import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function useFetchTodos() {
    const { token } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        fetch('/api/todos', {
            headers: {
                Authorization: 'Bearer '+ token
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setTasks(data);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error);
                setIsLoading(false);
            });
    }, [token]);

    return { tasks, isLoading, error, setTasks};
}

export default useFetchTodos;
