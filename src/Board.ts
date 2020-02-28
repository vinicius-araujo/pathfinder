import { Dijkstra } from './algorithm/dijkstra';
import { INode } from './model/node.model';
import { Node } from './Node';

export class Board {

  private button_run: any;
  private button_clean: any;
  private button_mode: any;
  private board: any;
  private table: any;
  private grid: INode[][];
  private START_NODE_ROW = 8;
  private START_NODE_COL = 4;
  private FINISH_NODE_ROW = 8;
  private FINISH_NODE_COL = 25;
  private isMousePressed = false;
  private nodeWallMode = true;

  constructor(row: number, col: number, table: Element) {
    this.grid = this.createGrid(row, col);
    this.table = table;
    this.nodeWallMode = true;

    this.button_run = document.getElementById('btn_run');
    this.button_clean = document.getElementById('btn_clean');
    this.button_mode = document.getElementById('node_mode');
    this.board = document.getElementById('board');

    this.init(table);
    this.activeMouseListener();
    window.document.addEventListener("keyup", this.handleShortcuts.bind(this), false);
  }

  init = (table: Element) => {
    let tableHTML = '';
    let newNodeClass = '';
    this.grid.map((row: INode[], rIndex: number) => {
      let currentHTMLRow = `<tr id="row_${rIndex}">`;
      row.map((node: INode, cIndex: number) => {
        newNodeClass = "unvisited";
        if (node.isStart) {
          currentHTMLRow += `<td id="node_${rIndex}_${cIndex}" class="start"><span class="item start-item"></span</td>`;
        } else if (node.isFinish) {
          currentHTMLRow += `<td id="node_${rIndex}_${cIndex}" class="start"><span class="item target-item"></span</td>`;
        } else {
          currentHTMLRow += `<td id="node_${rIndex}_${cIndex}" class="${newNodeClass}"></td>`;
        }
      })
      tableHTML += `${currentHTMLRow}</tr>`;
    })
    table.innerHTML = `<tbody>${tableHTML}</tbody>`;
  }

  activeMouseListener = () => {
    this.button_run.addEventListener('click', this.runPathFinder, false);
    this.button_clean.addEventListener('click', this.clearBoard, false);
    this.button_mode.addEventListener('click', this.toggleMode, false);
    this.board.addEventListener("touchstart", this.handleMouseDown, false);
    this.board.addEventListener("touchmove", this.handleMouseMove, false);
    this.board.addEventListener('mousedown', this.handleMouseDown, false)
    this.board.addEventListener('mousemove', this.handleMouseMove, false);
    window.document.addEventListener('mouseup', this.handleMouseUp, false);

    const allGrid = this.grid.flat(2);
    for (let i = 0; i < allGrid.length; i++) {
      let currentElement = document.getElementById(`node_${allGrid[i].row}_${allGrid[i].col}`);
      currentElement.addEventListener('mouseenter', this.handleMouseEnter, false);
    }
  }

  runPathFinder = () => {
    const startNode = this.grid[this.START_NODE_ROW][this.START_NODE_COL];
    const finishNode = this.grid[this.FINISH_NODE_ROW][this.FINISH_NODE_COL];
    const dijkstra = new Dijkstra(this.grid, startNode, finishNode);
    const nodesInShortestPathOrder = this.getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(dijkstra.visitedNodesInOrder, nodesInShortestPathOrder);
    this.inactiveButtons();
  }

  private inactiveButtons() {
    this.button_run.classList.add('inactive');
    this.button_run.setAttribute('disabled', 'disabled');
    this.button_clean.classList.add('inactive');
    this.button_clean.setAttribute('disabled', 'disabled');
    this.board.removeEventListener('mousedown', this.handleMouseDown, false);
  }

  private activeButtons() {
    this.button_run.classList.remove('inactive');
    this.button_run.removeAttribute('disabled');
    this.button_clean.classList.remove('inactive');
    this.button_clean.removeAttribute('disabled');
  }

  handleShortcuts(e: KeyboardEvent) {
    if (this.button_run.classList.contains('inactive')) {
      return false;
    }
    switch (e.key) {
      case 'c':
        this.clearBoard();
        break;
      case 'm':
        this.button_mode.click();
        break;
      case 'r':
        this.runPathFinder();
        break;
      default:
        break;
    }
  }

  animateDijkstra(visitedNodesInOrder: INode[], nodesInShortestPathOrder: INode[]) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node_${node.row}_${node.col}`).className =
          'node node--visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder: INode[]) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node_${node.row}_${node.col}`).className =
          'node node--shortest';
        if (i === (nodesInShortestPathOrder.length - 1)) {
          this.activeButtons();
        }
      }, 50 * i);
    }
  }

  private toggleWallNode(e: any) {
    const [node, givenRow, giverCol] = e.target.id.split("_");
    const row = parseInt(givenRow, 10);
    const col = parseInt(giverCol, 10);
    this.grid[row][col].setWall = this.nodeWallMode
    if (this.grid[row][col].isWall) {
      document.getElementById(`node_${row}_${col}`).className = 'node node--wall';
    } else {
      document.getElementById(`node_${row}_${col}`).className = 'unvisited';
    }
  }

  getNodesInShortestPathOrder(finishNode: INode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.getPreviousNode;
    }
    return nodesInShortestPathOrder;
  }

  createGrid = (givenRow: number = 2, giverCol: number = 2): Array<any> => {
    const grid = [];
    for (let row = 0; row < givenRow; row++) {
      const currentRow = [];
      for (let col = 0; col < giverCol; col++) {
        currentRow.push(this.createNode(col, row))
      }
      grid.push(currentRow);
    }
    return grid;
  }

  createNode = (col: number, row: number) => {
    const isStart = row === this.START_NODE_ROW && col === this.START_NODE_COL;
    const isFinish = row === this.FINISH_NODE_ROW && col === this.FINISH_NODE_COL;
    return new Node(row, col, isStart, isFinish);
  };

  clearBoard = () => {
    this.grid = this.createGrid(20, 30);
    this.init(this.table);
    this.activeMouseListener();
  }

  toggleMode = () => {
    this.nodeWallMode = !this.nodeWallMode;
  }

  generateMaze = () => { }

  handleMouseDown = (e: any, el: any) => {
    e.preventDefault()
    this.isMousePressed = true;
    if (!!e.target) {
      this.toggleWallNode(e);
    }
  }

  handleMouseUp = (e: any) => {
    this.isMousePressed = false;
  }

  handleMouseEnter = (e: any) => {
    e.preventDefault()
    if (this.isMousePressed) {
      if (!!e.target) {
        this.toggleWallNode(e);
      }
    }
  }

  handleMouseMove = (e: any, el: any) => {
    e.preventDefault()
  }

}
