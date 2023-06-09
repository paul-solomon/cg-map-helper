import { Component, OnInit } from '@angular/core';

export interface Tile {
    row: number;
    col: number;
    index: number;
    isCenterTile?: boolean;
    isBaseTile?: boolean;
    initialPath?: boolean;
    potentialDemiBoss?: boolean;
    hasFish?: boolean;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    tiles: Tile[] = [];
    optimalDemibossTiles = [2, 3, 4, 14, 20, 21, 27, 28, 34, 44, 45, 46];
    canBeStartingRoom = [17, 23, 25, 31];

    markedStartingRoom: boolean = false;

    ngOnInit() {
        this.generateGrid();
    }

    private generateGrid() {
        for (let i = 0; i < 49; i++) {
            this.tiles.push({
                row: Math.floor(i / 7) + 1,
                col: (i % 7) + 1,
                index: i,
                isCenterTile: i === 24,
                potentialDemiBoss: this.optimalDemibossTiles.includes(i),
                hasFish: false,
            });
        }
    }

    onTileClick(tile: Tile) {
        if (!this.markedStartingRoom) {
            if (!this.canBeStartingRoom.includes(tile.index)) return;
            this.markedStartingRoom = true;
            this.markStartingRoom(tile);
            this.findOptimalFirstPath(tile);
        } else {
            this.markHasFish(tile);
        }
    }

    markStartingRoom(tile: Tile) {
        tile.isBaseTile = true;
    }

    markHasFish(tile: Tile) {
        tile.hasFish = !tile.hasFish;
    }

    findOptimalFirstPath(tile: Tile) {
        let adjacentTiles = this.tiles.filter(
            (t) => t.row >= tile.row - 1 && t.row <= tile.row + 1 && t.col >= tile.col - 1 && t.col <= tile.col + 1
        );
        adjacentTiles.splice(4, 1);

        const baseTile = this.tiles.find((t) => t.isBaseTile);

        if (baseTile) {
            if (baseTile.row === 4) {
                adjacentTiles = adjacentTiles.filter((t) => t.col !== 4);
            }

            if (baseTile.col === 4) {
                adjacentTiles = adjacentTiles.filter((t) => t.row !== 4);
            }
        }

        adjacentTiles.map((t) => {
            t.initialPath = true;
        });
    }

    reset() {
        this.tiles = [];
        this.markedStartingRoom = false;
        this.generateGrid();
    }
}
