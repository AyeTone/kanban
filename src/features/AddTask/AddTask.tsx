import styles from "./AddTask.module.scss";
import Cross from "../../assets/icon-cross.svg";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import {
  removeSubtask,
  toggleStatusesList,
  updateDescription,
  updateStatus,
  updateSubtasks,
  updateTitle,
  addSubtask,
  resetAddTask,
  createID,
} from "./addTaskSlice";
import { useEffect } from "react";
import { ITask } from "../../models/ITask";
import { toggleAddNewTask } from "../../context/modals";
import { addTaskToColumn } from "../../context/boards";
import { ISubTask } from "../../models/ISubtask";
import Modal from "../../components/Modals/Modal";
import StatusSelection from "../../components/StatusSelection/StatusSelection";
import { nanoid } from "@reduxjs/toolkit";
import EditableList from "../../components/EditableList/EditableList";

const AddTask = () => {
  const { boards } = useAppSelector((state) => state.boards);
  const {
    title,
    description,
    subtasks,
    status,
    statusListIsOpen,
    id,
    viewTask,
  } = useAppSelector((state) => state.addTask);
  const currentBoard = boards.find((board) => board.isCurrent)!;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateStatus(currentBoard.columns[0].name));
    dispatch(createID(nanoid()));
  }, []);

  function changeStatus(e: string) {
    dispatch(updateStatus(e));
  }

  function toggleStatus() {
    dispatch(toggleStatusesList());
  }

  function addNewSubTask(e: any) {
    e.preventDefault();
    dispatch(addSubtask());
  }

  function closeModal() {
    dispatch(toggleAddNewTask(false));
  }

  function sendNewTask(e: any) {
    e.preventDefault();
    const validSubtasks = subtasks.filter(
      (subtask: ISubTask) => subtask.title !== ""
    );
    const newTask: ITask = {
      id,
      title,
      description,
      status,
      statusListIsOpen: false,
      viewTask,
      subtasks: validSubtasks,
    };

    const filledCorretly = Object.values(newTask).every(
      (value) => value != null && value !== ""
    );

    if (filledCorretly) {
      dispatch(addTaskToColumn({ column: status, task: newTask }));
      dispatch(toggleAddNewTask(false));
      dispatch(resetAddTask());
    }
  }

  const activeSubtasks = subtasks.map((subtask: ISubTask) => {
    const { title, placeholder, id } = subtask;

    function updateTask(updated: string) {
      dispatch(updateSubtasks({ id, title: updated }));
    }

    function removeTask(subtaskId: string) {
      dispatch(removeSubtask(subtaskId));
    }

    return (
      <EditableList
        key={id}
        id={id}
        updateText={updateTask}
        remove={removeTask}
        text={title}
        placeholder={placeholder}
      />
    );
  });

  return (
    <Modal toggle={closeModal}>
      <h3 className={styles.header}>Add New Task</h3>
      <form onSubmit={(e) => sendNewTask(e)} className={styles.form}>
        <label className={styles.label}>
          Title
          <input
            onChange={(e) => dispatch(updateTitle(e.target.value))}
            value={title}
            type="text"
            placeholder="e.g Take coffee break"
          />
        </label>
        <label className={styles.label}>
          Description
          <textarea
            onChange={(e) => dispatch(updateDescription(e.target.value))}
            value={description}
            rows={5}
            placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a litte."
          />
        </label>
        <label className={styles.label}>
          Subtasks
          {activeSubtasks}
        </label>
        <button onClick={(e) => addNewSubTask(e)} className={styles.addsubtask}>
          + Add New Subtask
        </button>
        <label className={styles.label}>
          Status
          <StatusSelection
            status={status}
            statusListIsOpen={statusListIsOpen}
            columns={currentBoard.columns}
            changeStatus={changeStatus}
            toggleStatus={toggleStatus}
          />
        </label>

        <button type="submit" className={styles.button}>
          Create Task
        </button>
      </form>
    </Modal>
  );
};

export default AddTask;
