import React, { useEffect, useRef, useState } from "react";
import "./crus.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { addTask, updateTask, deleteTask } from "../redux/taskslice";
const CrudHome = () => {
  const [task, setTask] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempTaskText, setTempTaskText] = useState(""); // تأكد من أن هذا موجود
  const [taskColor, setTaskColor] = useState({}); // لتغيير اللون
  const [taskState, setTaskState] = useState({}); // لتحديد حالة الأزرار

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);
  const inputRef = useRef(null); // Reference to the input field for focusing
  const modalRef = useRef(null);
  const [taskStatus, setTaskStatus] = useState({});

  const changle = (taskId) => {
    setTaskStatus((prevState) => ({
      ...prevState,
      [taskId]: false, // تغيير حالة المهمة
    }));
  };

  const handleGreen = (taskId) => {
    setTaskColor((prevState) => ({
      ...prevState,
      [taskId]: "green", // تغيير اللون إلى الأخضر
    }));
    setTaskState((prevState) => ({
      ...prevState,
      [taskId]: "green", // تغيير الحالة إلى green
    }));
  };

  const handlered = (taskId) => {
    setTaskColor((prevState) => ({
      ...prevState,
      [taskId]: "red", // تغيير اللون إلى الأحمر
    }));
    setTaskState((prevState) => ({
      ...prevState,
      [taskId]: "red", // تغيير الحالة إلى red
    }));
  };

  const openModal = () => {
    setIsModalOpen(true);
    setShowInput(false);
    setEditTaskId(null);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setShowInput(false);
    setEditTaskId(null);
    setTempTaskText("");
  };

  const handleDoneClick = () => {
    if (task.trim() !== "") {
      dispatch(addTask({text:task}));
      setTask("");
    }
    closeModal();
  };
  const handleCancelClick2 = () => {
    closeModal();
  };

  const handleEditClick = (task) => {
    setEditTaskId(task.id);
    setTempTaskText(task.text);
    setShowInput(true);
  };

  const handleUpdateTask = () => {
    if (tempTaskText.trim() !== "") {
      dispatch(updateTask({ id: editTaskId, newText: tempTaskText })); // تمرير id والنص الجديد
      setEditTaskId(null); // إلغاء وضع التحرير
      setTempTaskText(""); // إعادة تعيين tempTaskText
      setShowInput(false); // إخفاء حقل الإدخال
    }
  };

  const handleDeleteClick = (id) => {
    dispatch(deleteTask(id));
  };

  // Combined useEffect to handle outside click for both modals
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isModalOpen && inputRef.current) {
        inputRef.current.focus();
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen || showInput) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isModalOpen, showInput]);

  return (
    <div className="container ">
      <h1>Todo List</h1>

      <div className=" hal">
        <button onClick={openModal} className="s ">
          +
        </button>
        {isModalOpen && (
          <div ref={modalRef} className="d-flex inn ">
            <input
              ref={inputRef} // Focus on this input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="add any task"
            />

            <button onClick={closeModal} className="cancel">
              Cancel
            </button>
            <button onClick={handleDoneClick} className="done">
              Done
            </button>
          </div>
        )}

        <div className="lol ">
          <ul className="list-item">
            {tasks.map((task) => (
              <li 
                key={task.id}
                className={taskColor[task.id] ? taskColor[task.id] : "" }
              >
                <div className="mapa d-flex">
                    <div className="kos">
                   <p className="task-time">{task.createdAt}</p> {/* عرض الوقت */}
                    <p className="klam">{task.text}</p>
</div>
                  
                 
                    {/* إذا كانت الحالة هي red أو green، يظهر زر الحذف فقط */}
                    {taskState[task.id] === "red" ||
                    taskState[task.id] === "green" ? (
                      <button
                        className="awl"
                        onClick={() => handleDeleteClick(task.id)}
                      >
                        <FontAwesomeIcon className="igr" icon={faTrash} />
                      </button>
                    ) : (
                      <>
                        <button
                          className="awl"
                          onClick={() => handleDeleteClick(task.id)}
                        >
                          <FontAwesomeIcon className="igr" icon={faTrash} />
                        </button>
                        <button
                          className="tany"
                          onClick={() => handleEditClick(task)}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        {editTaskId === task.id && showInput && (
                          <div ref={modalRef} className="d-flex inn">
                            <input
                              type="text"
                              onChange={(e) => setTempTaskText(e.target.value)}
                              placeholder="Edit task"
                            />
                            <button
                              onClick={handleCancelClick2}
                              className="cancel"
                            >
                              Cancel
                            </button>
                            <button onClick={handleUpdateTask} className="done">
                              Edit
                            </button>
                          </div>
                        )}
                        {/* الزر الثالث (الذي يجعل الخلفية حمراء ويعرض زر الحذف فقط) */}
                        <button
                          className="talt"
                          onClick={() => {
                            handlered(task.id);
                            changle(task.id);
                          }}
                        >
                          <FontAwesomeIcon icon={faTimesCircle} />
                        </button>
                        {/* الزر الرابع (الذي يجعل الخلفية خضراء ويعرض زر الحذف فقط) */}
                        <button
                          className="rab"
                          onClick={() => {
                            handleGreen(task.id);
                            changle(task.id);
                          }}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      </>
                    )}
                  </div>
               
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default CrudHome;
