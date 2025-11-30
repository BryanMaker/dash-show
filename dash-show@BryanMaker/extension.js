import Clutter from 'gi://Clutter';
import St from 'gi://St';
import GObject from 'gi://GObject';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

const DesktopDash = GObject.registerClass(
class DesktopDash extends Clutter.Actor {
    _init() {
        super._init();

        this._dash = Main.overview.dash;
        this._dash_idx = Main.overview._overview._controls.get_children().indexOf(this._dash);

        // 自动移动dash
        Main.overview.connectObject('shown', () => this._restoreDashFromBg(), this);
        Main.overview.connectObject('hidden', () => this._moveDashToBg(), this);

        // this._moveDashToBg();

        // 处理 Show Apps 点击事件
        this._dash.showAppsButton.connectObject('notify::checked', (button) => {
            if (button.checked) {
                Main.overview.showApps()
            }
        }, this);

        // 处理dash大小变化
        this._dash.connectObject('notify::width', () => this._recenterDash(), this);
        this._dash.connectObject('notify::height', () => this._recenterDash(), this);
        // 无法监听屏幕大小变化信号，当设置分辨率缩放和旋转方向改变后，桌面dash位置错误。
        // 此时如果打开Overview，dash受概览布局管理它的大小会自适应。
        // 由于dash大小变换触发重新设置位置。这是一个妥协的可接受方案。
        this._recenterDash();
    }

    _moveDashToBg() {
        // 移除 Dash 从概览
        if (Main.overview._overview._controls.get_children().includes(this._dash)) {
            Main.overview._overview._controls.remove_child(this._dash);
            Main.layoutManager._backgroundGroup.add_child(this._dash);

            // 加入Chrome
            //Main.layoutManager.addChrome(this._dash, {
            //    affectsInputRegion: true,
            //    trackFullscreen: true,
            //});
        }
    }

    _restoreDashFromBg() {
        // 卸载扩展时恢复 Dash 到概览
        if (this._dash && (this._dash.get_parent() === Main.layoutManager._backgroundGroup)) {
            this._dash.get_parent().remove_child(this._dash);
            //Main.layoutManager.removeChrome(this._dash);
            Main.overview._overview._controls.insert_child_at_index(this._dash, this._dash_idx);
        }
    }
    
    _recenterDash() {
        // 获取主屏幕尺寸并设置dash位置
        let monitor = Main.layoutManager.primaryMonitor;
        this._dash.set_position((monitor.width - this._dash.width) / 2, monitor.height - this._dash.height);
    }

    destroy() {
        Main.overview.disconnectObject(this);

        this._dash?.showAppsButton?.disconnectObject(this);
        this._dash?.disconnectObject(this);

        this._restoreDashFromBg();

        super.destroy();
    }
});

export default class DashExtension extends Extension {
    _initDesktopDash() {
        this._desktopDash = new DesktopDash();
    }

    enable() {
        if (Main.layoutManager._startingUp) {
            // Main.layoutManager.connectObject('startup-complete', this._initDesktopDash.bind(this), this);
            Main.layoutManager.connectObject('startup-complete', () => this._initDesktopDash(), this);
        } else {
            this._initDesktopDash();
        }
    }

    disable() {
        if (this._desktopDash) {
            this._desktopDash.destroy();
            this._desktopDash = null;
        }

        Main.layoutManager.disconnectObject(this);
    }
}
