import React from 'react';
import useFetchTodos from '../hooks/useFetchTodos';

export default function Tasks() {
    const { tasks, isLoading, error } = useFetchTodos();

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
