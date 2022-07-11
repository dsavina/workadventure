import { IframeApiContribution, sendToWorkadventure } from "./IframeApiContribution";
import { Observable, Subject } from "rxjs";
import type { WasCameraUpdatedEvent } from "../Events/WasCameraUpdatedEvent";
import { apiCallback } from "./registeredCallbacks";

const moveStream = new Subject<WasCameraUpdatedEvent>();

export class WorkAdventureCameraCommands extends IframeApiContribution<WorkAdventureCameraCommands> {
    callbacks = [
        apiCallback({
            type: "wasCameraUpdated",
            callback: (payloadData) => {
                moveStream.next(payloadData);
            },
        }),
    ];

    public set(
        x: number,
        y: number,
        width?: number,
        height?: number,
        lock: boolean = false,
        smooth: boolean = false
    ): void {
        sendToWorkadventure({
            type: "cameraSet",
            data: { x, y, width, height, lock, smooth },
        });
    }

    public followPlayer(smooth: boolean = false): void {
        sendToWorkadventure({
            type: "cameraFollowPlayer",
            data: { smooth },
        });
    }

    onCameraUpdate(): Observable<WasCameraUpdatedEvent> {
        sendToWorkadventure({
            type: "onCameraUpdate",
            data: undefined,
        });
        return moveStream.asObservable();
    }
}

export default new WorkAdventureCameraCommands();
