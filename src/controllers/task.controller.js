import { Task } from '../models/task.js';

async function getTasks(req, res, next) {
  const { userId } = req.user;
  try {
    const tasks = await Task.findAll({
        attributes: ['id', 'name', 'done'],
        order : [['id', 'ASC']],
        where: {
          userId
        }
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function createTask(req, res, next) {
  const { userId } = req.user;
  const { name } = req.body;
  console.log('Creating task:', name, 'for user:', userId);

  try {
    const task = await Task.create({
      name,
      userId
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error desde el controlador' });
  }
}

async function getTask(req, res, next) {
    const { id } = req.params;
    const { userId } = req.user;
    if (!id) {
        return res.status(400).json({ message: 'Task ID is required' });
    }
    try {
        const task = await Task.findOne({
            attributes: ['name', 'done'],
            where: {
                id,
                userId
            }
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}

async function updateTask(req, res, next) {
    const { id } = req.params;
    const { userId } = req.user;
    const { name } = req.body;

    try {
        const task = await Task.update(
            {
                name
            },
            {
                where: {
                    id,
                    userId
                }
            }
        );

        if(task[0] === 0) {
            return res.status(404).json({ message: 'Task not found or no changes made' });
        }
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}

async function taskDone(req, res, next) {
    const { id } = req.params;
    const { userId } = req.user;
    const { done } = req.body;

    try {
        const task = await Task.update(
            {
                done
            },
            {
                where: {
                    id,
                    userId
                }
            }
        );

        if(task[0] === 0) {
            return res.status(404).json({ message: 'Task not found or already done' });
        }
        res.status(200).json({ message: 'Task marked as done' });
    } catch (error) {
        next(error);
    }
}

async function deleteTask(req, res, next) {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        const task = await Task.destroy({
            where: {
                id,
                userId
            }
        });

        if (task === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
}

export default {
    getTasks,
    createTask,
    getTask,
    updateTask,
    taskDone,
    deleteTask
}