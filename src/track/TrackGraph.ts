import {Track} from "./Track";
import {City} from "../City";

export class TrackGraph {

    private readonly cities: City[] = []
    private readonly tracks: Track[] = []
    private readonly shortestPaths: { origin: City, destination: City, path: Track[] }[] = []

    afterTrackAdded(track: Track) {
        this.tracks.push(track)
        this.recalculateAllPaths()
        this.log()
    }

    afterTrackRemoved(track: Track) {
        const idx = this.tracks.indexOf(track)
        if (idx >= 0) {
            this.tracks.splice(idx, 1)
            this.recalculatePathsWithTrack(track)
        }
        this.log()
    }

    afterCityAdded(city: City) {
        this.calculateAllPathsForCity(city)
        this.cities.push(city)
        this.log()
    }

    private log() {
        console.log(this.shortestPaths.map(p => ({o: p.origin.name, d: p.destination.name, l: p.path.length})))
    }

    private calculateAllPathsForCity(city: City) {
        for(const otherCity of this.cities) {
            this.shortestPaths.push({
                origin: otherCity,
                destination: city,
                path: this.calculatePath(otherCity, city)
            })
            this.shortestPaths.push({
                origin: city,
                destination: otherCity,
                path: this.calculatePath(city, otherCity)
            })
        }
    }

    private recalculatePathsWithTrack(track: Track) {
        for (const sp of this.shortestPaths) {
            if (sp.path.includes(track)) {
                sp.path = this.calculatePath(sp.origin, sp.destination)
            }
        }
    }

    private recalculateAllPaths() {
        this.shortestPaths.splice(0, this.shortestPaths.length)
        for (const origin of this.cities) {
            for (const destination of this.cities) {
                if (origin === destination) continue
                this.shortestPaths.push({
                    origin: origin,
                    destination: destination,
                    path: this.calculatePath(origin, destination)
                })
            }
        }
    }

    private calculatePath(origin: City, destination: City): Track[] {
        const originTrack = this.tracks.find(t => t.station === origin)
        const destinationTrack = this.tracks.find(t => t.station === destination)
        if (!originTrack || !destinationTrack) {
            throw new Error("unknown cities")
        }
        return originTrack.shortestPathTo(destinationTrack)
    }
}
