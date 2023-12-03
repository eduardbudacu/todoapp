import { useState, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function usePostTodo({tasks, setTasks}) {
    const { token } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState({});

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const description = data.get('todo');
        setIsLoading(true);
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description })
        });
        if (response.ok) {
            const responseData = await response.json()
            setResult(responseData);
            setIsLoading(false);
            event.target.reset();
            setTasks([responseData,...tasks]);
        } else {
            const responseData = await response.json();
            setError(responseData.message);
            setIsLoading(false);
        }
    }, [token, setTasks, tasks])

    return { result, isLoading, error, handleSubmit }
}