
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { CONF_CALL, generateCells, ifBingoFormed, isCenterCell } from './utils';

const BingoGrid = ({ size = 5 }) => {
  const [gridCells, setGridCells] = useState(generateCells(size));
  const [activeCell, setActiveCell] = useState();
  const [isBingoFormed, setIsBingoFormed] = useState(false);

  const handleClick = (clickedCell) => (_ => {

    setActiveCell(clickedCell);

    setGridCells(() => {
      return gridCells.map(cell => {
        if (cell.cellId === clickedCell.cellId) {
          cell.selected = true;
        }
        return cell;
      })
    })

  })

  useEffect(() => {
    if (activeCell) {
      const bingoCellsMap = ifBingoFormed(gridCells, activeCell, size);

      if (!bingoCellsMap) return;
      setGridCells(() => {
        return gridCells.map(cell => {
          if (cell.cellId in bingoCellsMap) {
            cell.bingoFormed = true;
          }
          return cell;
        })
      })

      setIsBingoFormed(true);
      setTimeout(() => setIsBingoFormed(false), 6000);

    }
  }, [gridCells, activeCell]);

  const ifSelected = (cell) => cell.selected && cell.message !== CONF_CALL;

  return (
    <div className="relative">
      <div className="w-full max-w-xl mx-auto transform -rotate-2 bg-white">
        <div className="grid grid-cols-5 border-t border-l border-gray-400">
          {gridCells.map(cell => (
            <div className="flex h-24 border-r border-b border-gray-400" key={cell.cellId}>
              <div className={clsx('p-2 pr-4 relative flex justify-center items-center text-sm',
                { 'hover:cursor-pointer': !cell.bingoFormed })} onClick={handleClick(cell)}>
                <div className={clsx('flex items-center justify-center h-full', {
                  'bg-gray-100': ifSelected(cell) && !cell.bingoFormed,
                  'bg-cyan-100': cell.bingoFormed
                })}>
                  {!isCenterCell(cell, size) && <span className="absolute top-2 right-2">{cell.cellId}</span>}
                  <div className={clsx('flex items-center text-center', {
                    'line-through': ifSelected(cell),
                    'rounded-full border-4 border-black h-full': isCenterCell(cell, size)
                  })}>{cell.message}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {
        isBingoFormed && (
          <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
            <img src="https://emojipedia-us.s3.amazonaws.com/source/skype/289/partying-face_1f973.png" alt="Congratulations" width="160" height="160" />
          </div>
        )
      }

    </div>
  );
}

export default BingoGrid;