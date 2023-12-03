import { useState, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function useDeleteTodo({tasks, setTasks}) {
    const { token } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState({});

    const handleDeleteTodo = useCallback(async (task) => {
        setIsLoading(true);
        const response = await fetch('/api/todos/'+task.id, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
        if (response.ok) {
            setResult(true);
            setIsLoading(false);


            setTasks([...tasks.filter(el => el.id !== task.id)]);
        } else {
            const responseData = await response.json();
            setError(responseData.message);
            setIsLoading(false);
        }
    }, [token, setTasks, tasks])

    return { result, isLoading, error, handleDeleteTodo }
}