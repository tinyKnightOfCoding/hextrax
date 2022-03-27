import {RailwayLine, Waypoint} from "./RailwayLine";

export interface Neighbour {
    cityName: string,
    distance: number,
    lineName: string,
    stopIndex: number
}

export interface Path {
    pos: string,
    hops: Neighbour[],
    distanceTravelled: number
}

export class TravelGraph {

    private readonly neighbours: { [key: string]: Neighbour[] } = {}

    constructor(...lines: RailwayLine[]) {
        for (const line of lines) {
            const stops = line.waypoints.map((v, i) => [v, i] as [Waypoint, number]).filter(([v, _]) => v.stopName)
            for (let i = 0; i < stops.length - 1; i++) {
                const currentStop = stops[i]
                const neighbourStop = stops[i + 1]
                this.putNeighbour(
                    currentStop[0].stopName!!,
                    {
                        cityName: neighbourStop[0].stopName!!,
                        distance: neighbourStop[1] - currentStop[1],
                        lineName: line.name,
                        stopIndex: currentStop[1]
                    })
            }
        }
    }

    findRoute(from: string, to: string): any {
        const paths: { pos: string, hops: Neighbour[], distanceTravelled: number }[] = []
        const possiblePaths: { pos: string, hops: Neighbour[], distanceTravelled: number }[] = [{
            pos: from,
            hops: [],
            distanceTravelled: 0
        }]
        while (possiblePaths.length > 0) {
            const path = possiblePaths.shift()!!
            if (path.pos === to) {
                paths.push(path)
                continue
            }
            const neighbours = this.neighbours[path.pos] || []
            for (let neighbour of neighbours) {
                if (path.hops.some(h => h.cityName === neighbour.cityName || h.cityName === from)) {
                    continue
                }
                const hops = [...path.hops]
                hops.push(neighbour)
                possiblePaths.push({
                    pos: neighbour.cityName,
                    hops,
                    distanceTravelled: path.distanceTravelled + neighbour.distance
                })
            }
        }
        if (paths.length === 0) {
            return undefined
        }
        let champion = paths.shift()!!
        for (const challenger of paths) {
            if (challenger.distanceTravelled < champion.distanceTravelled) {
                champion = challenger
            }
        }
        return champion
    }

    private putNeighbour(cityName: string, neighbour: Neighbour) {
        if (!this.neighbours[cityName]) {
            this.neighbours[cityName] = []
        }
        this.neighbours[cityName].push(neighbour)
    }
}
