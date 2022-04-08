import {AdvancedDynamicTexture, Control, TextBlock} from '@babylonjs/gui'


const REALTIME_MS_PER_HOUR = 1_000

export class Clock {

    private hours: number = 1
    private days: number = 1
    private weeks: number = 1
    private realtimePassedCurrentHour: number = 0
    private readonly textBlock: TextBlock
    private readonly realtimeHistory: number[] = []

    constructor(advancedTexture: AdvancedDynamicTexture) {
        this.textBlock = new TextBlock()
        this.textBlock.text = `hour ${this.hours}, day ${this.days}, week ${this.weeks}`
        this.textBlock.color = 'white'
        this.textBlock.fontSize = '20px'
        this.textBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
        this.textBlock.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
        this.textBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
        this.textBlock.top = '8px'
        this.textBlock.left = '8px'
        this.textBlock.resizeToFit = true
        advancedTexture.addControl(this.textBlock)
    }

    passTime(realtimeInMs: number, fps: number) {
        this.realtimePassedCurrentHour += realtimeInMs
        if (this.realtimePassedCurrentHour >= REALTIME_MS_PER_HOUR) {
            this.hours++
            this.realtimePassedCurrentHour -= REALTIME_MS_PER_HOUR
        }
        if (this.hours >= 24) {
            this.days++
            this.hours -= 24
        }
        if (this.days > 7) {
            this.days -= 7
            this.weeks++
        }
        this.realtimeHistory.push(realtimeInMs)
        while (this.realtimeHistory.length > 30) {
            this.realtimeHistory.shift()
        }
        this.textBlock.text = `hour ${this.hours}, day ${this.days}, week ${this.weeks} | ${this.realtimeAvg} | ${Math.ceil(fps)}`
    }

    get realtimeAvg(): number {
        const sum = this.realtimeHistory.reduce((a, b) => a + b, 0)
        return Math.ceil(sum / this.realtimeHistory.length)
    }
}
