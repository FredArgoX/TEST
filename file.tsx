import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const hours = Array.from({ length: 17 }, (_, i) => i + 6);

export default function DailyTasksVisualizer() {
  const [visibleHours, setVisibleHours] = useState(hours);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newTask, setNewTask] = useState({ name: "", start: "", end: "", color: "bg-blue-500", status: "Not Done" });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("start");

  const updateVisibleHours = () => {
    const width = window.innerWidth;
    if (width < 480) setVisibleHours([6, 12, 18]);
    else if (width < 768) setVisibleHours(hours.filter((_, i) => i % 4 === 0));
    else if (width < 1024) setVisibleHours(hours.filter((_, i) => i % 2 === 0));
    else setVisibleHours(hours);
  };

  useEffect(() => {
    updateVisibleHours();
    window.addEventListener("resize", updateVisibleHours);
    return () => window.removeEventListener("resize", updateVisibleHours);
  }, []);

  const handleAddTask = () => {
    const { name, start, end, color, status } = newTask;
    const startFloat = parseFloat(start.split(":" )[0]) + parseFloat(start.split(":" )[1]) / 60;
    const endFloat = parseFloat(end.split(":" )[0]) + parseFloat(end.split(":" )[1]) / 60;

    const taskData = { name, start: startFloat, end: endFloat, color, status };
    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = taskData;
      setTasks(updatedTasks);
    } else {
      setTasks([...tasks, taskData]);
    }

    setNewTask({ name: "", start: "", end: "", color: "bg-blue-500", status: "Not Done" });
    setShowModal(false);
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const task = tasks[index];
    const start = `${Math.floor(task.start).toString().padStart(2, '0')}:${Math.round((task.start % 1) * 60).toString().padStart(2, '0')}`;
    const end = `${Math.floor(task.end).toString().padStart(2, '0')}:${Math.round((task.end % 1) * 60).toString().padStart(2, '0')}`;
    setNewTask({ ...task, start, end });
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const toggleStatus = (index, status) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].status = status;
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks
    .filter(task => task.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "start") return a.start - b.start;
      if (sortOption === "end") return a.end - b.end;
      if (sortOption === "status") return a.status.localeCompare(b.status);
      return 0;
    });

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 md:px-12 py-8 font-mono">
      <h1 className="text-2xl sm:text-3xl mb-6 text-center font-bold text-white/80">
        Your Daily Task Timeline
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <button
          className="px-4 py-2 bg-white text-black rounded-lg"
          onClick={() => {
            setNewTask({ name: "", start: "", end: "", color: "bg-blue-500", status: "Not Done" });
            setEditIndex(null);
            setShowModal(true);
          }}
        >
          Add Task
        </button>

        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded bg-zinc-700 text-white w-full sm:w-64"
        />

        <select
          className="p-2 rounded bg-zinc-700 text-white w-full sm:w-48"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="start">Sort by Start Time</option>
          <option value="end">Sort by End Time</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-lg w-80">
            <h2 className="text-lg mb-4">{editIndex !== null ? "Edit Task" : "Add New Task"}</h2>
            <input
              type="text"
              placeholder="Task name"
              className="w-full mb-2 p-2 rounded bg-zinc-700 text-white"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            />
            <input
              type="time"
              className="w-full mb-2 p-2 rounded bg-zinc-700 text-white"
              value={newTask.start}
              onChange={(e) => setNewTask({ ...newTask, start: e.target.value })}
            />
            <input
              type="time"
              className="w-full mb-2 p-2 rounded bg-zinc-700 text-white"
              value={newTask.end}
              onChange={(e) => setNewTask({ ...newTask, end: e.target.value })}
            />
            <select
              className="w-full mb-4 p-2 rounded bg-zinc-700 text-white"
              value={newTask.color}
              onChange={(e) => setNewTask({ ...newTask, color: e.target.value })}
            >
              <option value="bg-blue-500">Blue</option>
              <option value="bg-green-500">Green</option>
              <option value="bg-purple-500">Purple</option>
              <option value="bg-yellow-500">Yellow</option>
              <option value="bg-pink-500">Pink</option>
              <option value="bg-red-500">Red</option>
              <option value="bg-cyan-500">Cyan</option>
            </select>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-green-500 text-black rounded"
                onClick={handleAddTask}
              >
                {editIndex !== null ? "Update" : "Add"}
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-black rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Card className="bg-zinc-900 border-zinc-700">
        <CardContent className="p-4">
          <div className="relative h-24 w-full border-t border-white/20">
            {hours.map((hour, index) => (
              <div
                key={hour}
                className="absolute top-0 h-full border-l border-white/10"
                style={{
                  left: `${(index / 17) * 100}%`,
                  width: `${100 / 17}%`
                }}
              >
                {visibleHours.includes(hour) && (
                  <div className="text-[10px] sm:text-xs text-white/50 text-center mt-2">
                    {hour}:00
                  </div>
                )}
              </div>
            ))}
            {filteredTasks.map((task, idx) => (
              <motion.div
                key={idx}
                className={cn(
                  "absolute top-8 h-8 rounded-xl shadow-lg border border-white/10 cursor-pointer",
                  task.color
                )}
                style={{
                  left: `${((task.start - 6) / 17) * 100}%`,
                  width: `${((task.end - task.start) / 17) * 100}%`,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleEdit(idx)}
              >
                <div className="flex justify-between items-center h-full px-2">
                  <span className="text-xs font-bold text-black/80">{task.name}</span>
                  <span className="text-xs text-black/60">{task.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredTasks.map((task, idx) => (
          <div
            key={idx}
            className={cn(
              "p-3 rounded-lg shadow-md border border-white/10 text-sm",
              task.color,
              "text-black"
            )}
          >
            <div className="font-bold mb-1">{task.name}</div>
            <div className="mb-1">Status: {task.status}</div>
            <div className="mb-1">{Math.floor(task.start).toString().padStart(2, '0')}:{Math.round((task.start % 1) * 60).toString().padStart(2, '0')} - {Math.floor(task.end).toString().padStart(2, '0')}:{Math.round((task.end % 1) * 60).toString().padStart(2, '0')}</div>
            <div className="flex gap-2 flex-wrap text-xs">
              <button className="bg-white px-2 py-1 rounded" onClick={() => handleEdit(idx)}>Edit</button>
              <button className="bg-green-300 px-2 py-1 rounded" onClick={() => toggleStatus(idx, "Done")}>Done</button>
              <button className="bg-yellow-300 px-2 py-1 rounded" onClick={() => toggleStatus(idx, "Not Done")}>Not Done</button>
              <button className="bg-red-400 px-2 py-1 rounded" onClick={() => handleDelete(idx)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
