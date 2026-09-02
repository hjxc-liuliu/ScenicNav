import { AbilityConstant, UIAbility, Want } from '@kit.AbilityKit';
import { window } from '@kit.ArkUI';

export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    console.info(`ScenicNav started: ${want.bundleName ?? 'unknown'}`);
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    windowStage.getMainWindow((windowError, mainWindow) => {
      if (windowError.code) {
        console.error(`Failed to get main window: ${JSON.stringify(windowError)}`);
        return;
      }
      mainWindow.setWindowSystemBarProperties({
        statusBarColor: '#F4F8F5',
        navigationBarColor: '#F4F8F5',
        statusBarContentColor: '#193528',
        navigationBarContentColor: '#193528'
      });
    });
    windowStage.loadContent('pages/Index', (err) => {
      if (err.code) {
        console.error(`Failed to load ScenicNav: ${JSON.stringify(err)}`);
      }
    });
  }
}
