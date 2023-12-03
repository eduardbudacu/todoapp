import React, { useContext } from 'react';
import useFetchTodos from '../hooks/useFetchTodos';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import TodoList from '../components/TodoList';
import Typography from '@mui/material/Typography';
import TodoForm from '../components/TodoForm';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Tasks() {
    const { authenticated } = useContext(AuthContext);
    const { tasks, isLoading, error, setTasks } = useFetchTodos();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (!authenticated) return <Navigate to='/' />;
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching tasks: {error.message}</p>;

    return (
        <div>
            <Typography component="h1" variant="h5">
                Tasks
            </Typography>
            <TodoForm tasks={tasks} setTasks={setTasks} />
            
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="tabs">
                        <Tab label="Backlog" {...a11yProps(0)} />
                        <Tab label="Completed" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <TodoList completed={false} items={tasks.filter(el => el.completed === false)} tasks={tasks} setTasks={setTasks} />   
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <TodoList completed={true} items={tasks.filter(el => el.completed === true)} tasks={tasks} setTasks={setTasks} />
                </CustomTabPanel>
            </Box>
        </div>
    );
}
