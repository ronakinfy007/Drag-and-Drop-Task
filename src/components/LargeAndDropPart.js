import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const initialTasks = [
  { id: "task1", title: "UI UX", description: "theme" },
  { id: "task2", title: "Drag & Drop", description: "one place" },
  { id: "task3", title: "Fully Functional", description: "Props" },
  { id: "task4", title: "Working", description: "Functionality" },
  { id: "task5", title: "Test-task", description: "work" },
  { id: "task6", title: "Responsive", description: "design" },
];

const initialDroppableAreas = [
  { id: "area1", title: "Dropping Part 1", description: "Drop Down here" },
  { id: "area2", title: "Dropping Part 2", description: "Drop Down here" },
  { id: "area3", title: "Dropping Part 3", description: "Drop Down here" },
  { id: "area4", title: "Dropping Part 4", description: "Drop Down here" },
  { id: "area5", title: "Dropping Part 5", description: "Drop Down here" },
  { id: "area6", title: "Dropping Part 6", description: "Drop Down here" },
  { id: "area7", title: "Dropping Part 7", description: "Drop Down here" },
  { id: "area8", title: "Dropping Part 8", description: "Drop Down here" },
  { id: "area9", title: "Dropping Part 9", description: "Drop Down here" },
];

const LargeAndDropPart = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });

  const [droppedItems, setDroppedItems] = useState(() => {
    const savedDroppedItems = localStorage.getItem("droppedItems");
    if (savedDroppedItems) {
      try {
        const parsedItems = JSON.parse(savedDroppedItems);
        return new Map(parsedItems);
      } catch {
        return new Map();
      }
    }
    return new Map();
  });

  const [draggingItems, setDraggingItems] = useState(new Set());
  const [draggingOverArea, setDraggingOverArea] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [removedTask, setRemovedTask] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      "droppedItems",
      JSON.stringify(Array.from(droppedItems.entries()))
    );
  }, [droppedItems]);

  const handleDragStart = (event) => {
    const itemId = event.target.id;
    setDraggingItems((prev) => new Set(prev).add(itemId));
  };

  const handleDragEnd = () => {
    setDraggingItems(new Set());
  };

  const handleDragOver = (event, areaId) => {
    event.preventDefault();
    setDraggingOverArea(areaId);
  };

  const handleDragLeave = () => {
    setDraggingOverArea(null);
  };

  const handleDrop = (event, areaId) => {
    event.preventDefault();
    setDraggingOverArea(null);
  
    const droppedTaskId = Array.from(draggingItems)[0];
    const droppedTask = tasks.find((task) => task.id === droppedTaskId);
  
    if (droppedTask) {
      const updatedDroppedItems = new Map(droppedItems);
  
      const existingTask = updatedDroppedItems.get(areaId);
      if (existingTask) {
        setTasks((prev) => [...prev, existingTask]);
      }
  
      updatedDroppedItems.set(areaId, droppedTask);
      setDroppedItems(updatedDroppedItems);
  
      setTasks((prev) => prev.filter((task) => task.id !== droppedTaskId));
    }
  
    setDraggingItems(new Set());
  };
  

  const handleRemove = (id, areaId) => {
    const updatedItems = new Map(droppedItems);
    const taskToMoveBack = updatedItems.get(areaId);
    updatedItems.delete(areaId);
    setDroppedItems(updatedItems);

    if (taskToMoveBack) {
      setRemovedTask(taskToMoveBack.id);
      setTimeout(() => {
        setRemovedTask(null);
        setTasks((prev) => [...prev, taskToMoveBack]);
      }, 1000);
    }
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim() === "" || newTaskDescription.trim() === "") {
      return;
    }

    const newTask = {
      id: `task${tasks.length + 1}`,
      title: newTaskTitle,
      description: newTaskDescription,
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  return (
    <div className="flex flex-col h-auto bg-white text-gray-900">
      <div className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-4 text-center shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 font-times">Drag and Drop Task</h1>
      </div>

      <div className="flex flex-col md:flex-row h-auto">
        <div className="flex-1 bg-white-900 text-white p-4 md:p-8">
          <div className="w-80 h-[30vh] p-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg shadow-lg mx-auto sm:w-[18rem] md:w-[20rem] lg:w-[22rem]">
            <h1 className="text-lg font-semibold mb-4 text-white">
              Add New Task
            </h1>
            <input
              type="text"
              placeholder="Task Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full mb-2 p-1 text-sm bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-yellow-300"
            />
            <textarea
              placeholder="Task Description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="w-full mb-2 p-1 text-sm bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-yellow-300"
              rows="2"
            />
            <button
              onClick={handleAddTask}
              className="w-full py-1 text-sm bg-yellow-700 text-white rounded-md hover:bg-yellow-800 transition"
            >
              Add Task
            </button>
          </div>

          <h2 className="text-xl font-semibold mt-8">Tasks</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                id={task.id}
                draggable
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                className={`bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform ${
                  draggingItems.has(task.id) ? "opacity-50" : ""
                }`}
              >
                <p className="font-bold">{task.title}</p>
                <p className="text-sm text-gray-400">{task.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {initialDroppableAreas.map((area) => (
            <div
              key={area.id}
              className={`relative bg-gray-200 p-4 rounded-lg border-2 ${
                draggingOverArea === area.id
                  ? "border-blue-500"
                  : "border-dashed border-gray-600"
              }`}
              onDragOver={(e) => handleDragOver(e, area.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, area.id)}
            >
              <p className="text-center text-black font-bold text-lg mb-2 text-black-400">
                {area.title}
              </p>
              {droppedItems.get(area.id) && (
                <div
                  className={`bg-gray-700 p-4 rounded-lg shadow-lg transition-opacity duration-1000 ${
                    removedTask === droppedItems.get(area.id).id
                      ? "opacity-0 scale-95"
                      : ""
                  }`}
                >
                  <p className="font-bold text-white">
                    {droppedItems.get(area.id).title}
                  </p>
                  <p className="text-sm text-gray-400">
                    {droppedItems.get(area.id).description}
                  </p>
                  <FaTimes
                    className="absolute top-2 right-2 cursor-pointer text-red-500"
                    onClick={() =>
                      handleRemove(droppedItems.get(area.id).id, area.id)
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LargeAndDropPart;
