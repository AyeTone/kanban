import { useAppDispatch, useAppSelector } from "../../context/hooks";
import { ReactComponent as BoardIcon } from "../../assets/icon-board.svg";
import { ReactComponent as LightTheme } from "../../assets/icon-light-theme.svg";
import { ReactComponent as DarkTheme } from "../../assets/icon-dark-theme.svg";
import { toggleAllBoardsModal, toggleBoardsEditor } from "../../context/modals";
import { changeBoard } from "../../context/boards";
import { toggleDarkMode } from "../../context/theme";
import { useEffect } from "react";

const BoardsNav = () => {
  const { boards } = useAppSelector((state) => state.boards);
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const currentTheme = !isDarkMode ? { left: "10%" } : { left: "55%" };

  function openBoardsEditor(e: any) {
    e.preventDefault();
    dispatch(toggleBoardsEditor(true));
    if (window.innerWidth < 768) {
      dispatch(toggleAllBoardsModal());
    }
  }

  function changeCurrentBoard(boardID: string, isCurrent: boolean) {
    if (!isCurrent) {
      dispatch(changeBoard(boardID));
    }
  }

  function toggleTheme() {
    dispatch(toggleDarkMode());
  }

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  const allBoards = boards.map((board) => (
    <button
      key={board.id}
      className={`boards-nav_board-name ${
        board.isCurrent && "boards-nav_current"
      }`}
      onClick={() => changeCurrentBoard(board.id, board.isCurrent)}
    >
      <BoardIcon />
      <p>{board.name}</p>
    </button>
  ));

  return (
    <div className="boards-nav_container">
      <h3>All boards ({boards.length}) </h3>
      <div className="boards-nav_list">
        {allBoards}
        <div className="boards-nav_list--create-new">
          <BoardIcon />
          <button onClick={(e) => openBoardsEditor(e)}>
            + Create New Board
          </button>
        </div>
      </div>

      <div className="boards-nav_theme-switcher">
        <LightTheme />

        <label>
          <input onClick={() => toggleTheme()} type="checkbox" />
          <span style={currentTheme}></span>
        </label>
        <DarkTheme />
      </div>
    </div>
  );
};

export default BoardsNav;
