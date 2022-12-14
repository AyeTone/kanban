import { ReactComponent as Show } from "../../assets/icon-show-sidebar.svg";
import { useAppDispatch, useAppSelector } from "../../context/hooks";
import Column from "../../components/Column/Column";
import MobileBoardsNav from "../MobileBoardsNav/MobileBoardsNav";
import {
  populatePassedData,
  toggleBoardsEditor,
  toggleSideBar,
} from "../../context/modals";

const Board = () => {
  const { boards } = useAppSelector((state) => state.boards);
  const { allBoardsModalIsOpen, sideBarIsOpen } = useAppSelector(
    (state) => state.modals
  );
  const currentBoard = boards.find((board) => board.isCurrent)!;
  const boardColumnsLength = currentBoard.columns.length;
  const dispatch = useAppDispatch();

  function openBoardEditor() {
    dispatch(toggleBoardsEditor(true));
    dispatch(populatePassedData(currentBoard));
  }

  function openSidebar() {
    dispatch(toggleSideBar(true));
  }

  return (
    <main
      className={`board_container ${
        boardColumnsLength === 0 ? "board_empty" : ""
      }`}
    >
      {boardColumnsLength === 0 && (
        <div className="board_empty--content">
          <p>This board is empty. Create a new column to get started.</p>
          <button onClick={() => openBoardEditor()}> + Add New Column </button>
        </div>
      )}

      {boardColumnsLength > 0 && (
        <div className="board_columns-container">
          {currentBoard.columns.map(({ id, name, tasks }) => (
            <Column key={id} name={name} tasks={tasks} />
          ))}
          <div className="board_new-column" onClick={() => openBoardEditor()}>
            <p>+ New Column</p>
          </div>
        </div>
      )}
      {!sideBarIsOpen && (
        <button onClick={() => openSidebar()} className="board_show-sidebar">
          <Show />
        </button>
      )}

      <div className="board_mobile-boards-nav">
        {allBoardsModalIsOpen && <MobileBoardsNav />}
      </div>
    </main>
  );
};

export default Board;
