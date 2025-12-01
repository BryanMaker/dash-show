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

        // 初始化dash所在层
        if (Main.overview.visible) {
            this._restoreDashFromBg();
        } else {
            this._moveDashToBg();
        }

        // 处理显示变化
        Main.layoutManager.connectObject('monitors-changed', () => this._recenterDash(), this);

        // 处理 Show Apps 点击事件
        this._dash.showAppsButton.connectObject('notify::checked', (button) => {
            if (button.checked) {
                Main.overview.showApps()
            }
        }, this);

        // 处理dash大小变化
        this._dash.connectObject('notify::width', () => this._recenterDash(), this);
        this._dash.connectObject('notify::height', () => this._recenterDash(), this);
        this._recenterDash();
    }

    _moveDashToBg() {
        // 移除 Dash 从概览
        if (Main.overview._overview._controls.get_children().includes(this._dash)) {
            Main.overview._overview._controls.remove_child(this._dash);
            Main.layoutManager._backgroundGroup.add_child(this._dash);
        }
    }

    _restoreDashFromBg() {
        // 卸载扩展时恢复 Dash 到概览
        if (this._dash && (this._dash.get_parent() === Main.layoutManager._backgroundGroup)) {
            this._dash.get_parent().remove_child(this._dash);
            Main.overview._overview._controls.insert_child_at_index(this._dash, this._dash_idx);
        }
    }
    
    _recenterDash() {
        // 获取主屏幕尺寸并设置dash位置
        let monitor = Main.layoutManager.primaryMonitor;
        this._dash.set_position((monitor.width - this._dash.width) / 2, monitor.height - this._dash.height);
    }

    destroy() {
        Main.layoutManager.disconnectObject(this);
        Main.overview.disconnectObject(this);

        this._dash?.showAppsButton?.disconnectObject(this);
        this._dash?.disconnectObject(this);

        this._restoreDashFromBg();

        super.destroy();
    }
});

export default class DashExtension extends Extension {
    constructor(metadata) {
        super(metadata);
    }

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
