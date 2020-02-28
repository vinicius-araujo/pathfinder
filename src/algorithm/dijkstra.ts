import { INode } from "../model/node.model";

export class Dijkstra {
    public visitedNodesInOrder: INode[];
    private finishNode: any;
    private grid: any;

    constructor(grid: any, startNode: INode, finishNode: INode) {
        this.finishNode = finishNode;
        this.grid = grid;
        this.visitedNodesInOrder = [];
        startNode.setDistance = 0;
        const unvisitedNodes = grid.flat(2);
        this.init(unvisitedNodes);
    }

    init(unvisitedNodes: INode[]) {
        while (!!unvisitedNodes.length) {
            this.sortNodesByDistance(unvisitedNodes);
            const closestNode = unvisitedNodes.shift();
            // If we encounter a wall, we skip it.
            if (closestNode.isWall) continue;
            // If the closest node is at a distance of infinity,
            // we must be trapped and should therefore stop.
            if (closestNode.getDistance === Number.MAX_SAFE_INTEGER) {
                return this.visitedNodesInOrder
            }
            closestNode.setVisited = true;
            this.visitedNodesInOrder.push(closestNode);
            if (closestNode === this.finishNode) {
                return this.visitedNodesInOrder;
            }
            this.updateUnvisitedNeighbors(closestNode, this.grid);
        }
    }

    private sortNodesByDistance(node: INode[]) {
        node.sort((nodeA: INode, nodeB: INode) => nodeA.getDistance - nodeB.getDistance);
    }

    private updateUnvisitedNeighbors(node: INode, grid: any) {
        const unvisitedNeighbors = this.getUnvisitedNeighbors(node, grid);
        for (const neighbor of unvisitedNeighbors) {
            neighbor.distance = node.getDistance + 1;
            neighbor.previousNode = node;
        }
    }

    private getUnvisitedNeighbors(node: INode, grid: any) {
        const neighbors = [];
        const { col, row } = node;
        if (row > 0) neighbors.push(grid[row - 1][col]);
        if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
        if (col > 0) neighbors.push(grid[row][col - 1]);
        if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
        return neighbors.filter(neighbor => !neighbor.isVisited);
    }


}