// @ts-ignore
import {defineStore} from "pinia";

type RootState = {
    currentEmergencyPanel: Object | string,
    currentBottomSelected: Object | null,
    TransparencyPlate: boolean | null,
    time: Number | null
}

type RootActions = {
    setCurrentEmergencyPanel: (panel: RootState["currentEmergencyPanel"]) => void,
    setCurrentBottomSelected: (panel: RootState["currentBottomSelected"]) => void,
}

// @ts-ignore
// @ts-ignore
export const useStore = defineStore<string, RootState, {}, RootActions>('main', {
    state: () => {
        return {
            currentEmergencyPanel: '',
            currentBottomSelected: null,
            TransparencyPlate: false,
            time: 2017
        };
    },
    actions: {
        setCurrentEmergencyPanel(panel: any) {
            // @ts-ignore
            this.currentEmergencyPanel = panel;
        },
        setCurrentBottomSelected(panel: any) {
            // @ts-ignore
            this.currentBottomSelected = panel;
        }
    }
});
