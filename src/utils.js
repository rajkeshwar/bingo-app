/*
 * @Author: Rajkeshwar Prasad(rajkeshwar.pd@gmail.com) 
 * @Date: 2022-07-26 00:48:40 
 * @Last Modified by: Rajkeshwar Prasad
 * @Last Modified time: 2022-07-26 17:24:06
 */

import { range, random, chunk, keyBy } from 'lodash';

const messages = [
  'Child noises in the background',
  'Hello, Hello?',
  'I need to jump in to another call',
  'Can everyone go on mute?',
  'Could you please get closer to the mic?',
  '(Load painful echo/ feedback)',
  'Next slide please',
  'can we take this offline?',
  'Is____on the call?',
  'Could you share this slide afterwards?',
  'Can somebody grants presenter rights?',
  'Can you email that to everyone?',
  'Sorry I had problems loging in',
  '(Animal noises in the background)',
  'Sorry I didn\'t found the conference id',
  'I was having connection issues',
  'I\'ll have to get back to you',
  'Who just joined?',
  'Sorry something____ with my calendar',
  'Do you see my screen?',
  'Lets wait for ____!',
  'You will send the minutes?',
  'Sorry, I was on mute.',
  'Can you repeat please'
];

export const CONF_CALL = `CONF CALL 😷 BINGO`;

export const isCenterCell = ({ row, column }, size) => {
  const MID = Math.floor(size / 2);
  return row === MID && column === MID;
}

export const generateCells = (size) => range(0, size).flatMap((_, row) => {

  if (size / 2 === 0) {
    throw Error('Size must be an even number');
  }

  return range(0, size).map((_, column) => ({
    row, column,
    cellId: 5 * row + column,
    selected: isCenterCell({ row, column }, size),
    message: isCenterCell({ row, column }, size)
      ? CONF_CALL
      : messages[random(messages.length - 1)]
  }))
});

const visitedBingo = new Set();

export const ifBingoFormed = (gridCells, cell, size) => {

  const matrix = chunk(gridCells, size);

  // Determine if the row is Bingo
  const bingoRow = Array(size)
    .fill(null)
    .map((_, i) => matrix[cell.row][i])
    .filter(eachCell => eachCell.selected);

  // Determine if the column is Bingo
  const bingoColumn = Array(size)
    .fill(null)
    .map((_, i) => matrix[i][cell.column])
    .filter(eachCell => eachCell.selected);

  // Determine if the diagonal is Bingo
  const bingoTopLeft = Array(size)
    .fill(null)
    .map((_, i) => matrix[i][i])
    .filter(eachCell => eachCell.selected);

  const bingoTopRight = Array(size)
    .fill(null)
    .map((_, i) => matrix[i][size - i - 1])
    .filter(eachCell => eachCell.selected);

  const bingoCells = [bingoRow, bingoColumn, bingoTopLeft, bingoTopRight].find(bingo => bingo.length === size);

  // Bingo not yet formed
  if (!bingoCells) return;

  const bingoCellsKey = bingoCells.map(b => b.row + ',' + b.column).join('|');

  // Return if the bingo is already formed earlier
  if (visitedBingo.has(bingoCellsKey)) {
    return;
  }

  visitedBingo.add(bingoCellsKey);

  // Return as map for O(1) lookup to disable the cells
  // in useEffect to mark the cells as cyan bg-color
  return keyBy(bingoCells, 'cellId');
}