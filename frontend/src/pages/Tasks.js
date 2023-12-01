import React, { useContext } from 'react';
import useFetchTodos from '../hooks/useFetchTodos';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Tasks() {
    const { token, authenticated } = useContext(AuthContext);
    const { tasks, isLoading, error } = useFetchTodos(token);

    if (!authenticated) return <Navigate to='/' />;
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching tasks: {error.message}</p>;

    return (
        <div>
            <h1>Tasks</h1>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>{task.description}</li>
                ))}
            </ul>
        </div>
    );
}
