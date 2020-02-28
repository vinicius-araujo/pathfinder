import { INode } from "./model/node.model";

export class Node {
    public col: number;
    public row: number;
    public start: boolean;
    public finish: boolean;
    public distance: number;
    public visited: boolean;
    public wall: boolean;
    public previousNode: null | any | Node;

    constructor(row: number, col: number, isStart: boolean, isFinish: boolean) {
        this.col = col;
        this.row = row;
        this.start = isStart;
        this.finish = isFinish
        this.visited = false;
        this.previousNode = null;
        this.wall = false;
        this.distance = Number.MAX_SAFE_INTEGER;
    }

    get isWall() {
        return this.wall;
    }

    get isStart() {
        return this.start;
    }

    get isFinish() {
        return this.finish;
    }

    get isVisited() {
        return this.visited;
    }

    get getDistance() {
        return this.distance;
    }

    get getPreviousNode() {
        return this.previousNode;
    }

    set setVisited(v: boolean) {
        this.visited = v;
    }

    set setDistance(n: number) {
        this.distance = n;
    }

    set setFinish(is: boolean) {
        this.finish = is;
    }

    set setPrevious(node: any) {
        this.previousNode = node;
    }

    set setWall(b: boolean) {
        this.wall = b;
    }
}