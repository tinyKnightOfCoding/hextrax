import {Track} from "./Track";
import {City} from "../City";

export class TrackGraph {

    private readonly cities: City[] = []
    private readonly tracks: Track[] = []
    private readonly shortestPaths: { origin: City, destination: City, path: Track[] }[] = []

    afterTrackAdded(track: Track) {
        this.tracks.push(track)
        this.recalculateAllPaths()
    }

    afterCityAdded(city: City) {
        this.calculateAllPathsForCity(city)
        this.cities.push(city)
    }

    path(origin: City, destination: City): Track[] {
        return this.shortestPaths.find(sp => sp.origin === origin && sp.destination === destination)?.path ?? []
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
