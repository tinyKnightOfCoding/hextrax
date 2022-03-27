import {RailwayLine, Waypoint} from "./RailwayLine";

interface Neighbour {
    cityName: string,
    distance: number,
    lineName: string,
    stopIndex: number
}

export interface Segment {
    lineName: string,
    stopIndex: number,
    destination: string
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
                        stopIndex: i
                    })
            }
        }
    }

    findRoute(from: string, to: string): Segment[] {
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
            return []
        }
        let champion = paths.shift()!!
        for (const challenger of paths) {
            if (challenger.distanceTravelled < champion.distanceTravelled) {
                champion = challenger
            }
        }
        return this.toSegments(champion.hops)
    }

    private toSegments(neighbours: Neighbour[]): Segment[] {
        const segments: Segment[] = []
        let currentI = 0
        for (let i = 0; i < neighbours.length; i++) {
            const currentNeigh = neighbours[currentI]
            const neigh = neighbours[i]
            if (currentNeigh.lineName !== neigh.lineName) {
                segments.push({
                    lineName: currentNeigh.lineName,
                    stopIndex: currentNeigh.stopIndex,
                    destination: neighbours[i - 1].cityName
                })
                currentI = i
            }
        }
        segments.push({
            lineName: neighbours[currentI].lineName,
            stopIndex: neighbours[currentI].stopIndex,
            destination: neighbours[neighbours.length - 1].cityName
        })
        return segments
    }

    private putNeighbour(cityName: string, neighbour: Neighbour) {
        if (!this.neighbours[cityName]) {
            this.neighbours[cityName] = []
        }
        this.neighbours[cityName].push(neighbour)
    }
}
