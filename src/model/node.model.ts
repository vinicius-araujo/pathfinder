export interface INode {
    col: number,
    row: number,
    isStart: boolean,
    isFinish: boolean,
    getDistance: number,
    isVisited: boolean,
    isWall: boolean,
    getPreviousNode: null | any | INode,
    setPreviousNode: null | any | INode,
    setDistance: number;
    setWall: boolean;
    setVisited: boolean
}