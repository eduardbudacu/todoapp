import { useState, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function useCompleteTodo({tasks, setTasks}) {
    const { token } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState({});

    const handleCompleteTodo = useCallback(async (task) => {
        setIsLoading(true);
        const response = await fetch('/api/todos/'+task.id, {
            method: 'PATCH',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !task.completed })
        });
        if (response.ok) {
            const responseData = await response.json()
            setResult(responseData);
            setIsLoading(false);
            const index = tasks.findIndex(task => task.id === responseData.id);
            tasks[index] = responseData;
            setTasks([...tasks]);
        } else {
            const responseData = await response.json();
            setError(responseData.message);
            setIsLoading(false);
        }
    }, [token, setTasks, tasks])

    return { result, isLoading, error, handleCompleteTodo }
}