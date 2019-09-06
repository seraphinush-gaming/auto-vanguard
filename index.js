'use strict';

class AutoVanguard {

  constructor(mod) {

    this.mod = mod;
    this.cmd = mod.command;
    this.game = mod.game;
    this.settings = mod.settings;

    this.enable = this.settings.enable;
    this.hold = false;
    this.name = '';
    this.quest_id = [];

    // command
    this.cmd.add('vg', {
      '$none': () => {
        this.settings.enable = !this.settings.enable;
        this.enable = this.settings.enable;
        this.send(`${this.settings.enable ? 'En' : 'Dis'}abled`);
      },
      'add': () => {
        this.settings.charExclusion[this.name] = true;
        this.enable = false;
        this.send(`Added player &lt;${this.name}&gt; to be excluded from auto-vanguard completion.`);
      },
      'rm': () => {
        if (this.settings.charExclusion[this.name]) {
          delete this.settings.charExclusion[this.name];
          this.send(`Removed player &lt;${this.name}&gt; to be included in auto-vanguard completion.`);
        } else {
          this.send(`Player &lt;${this.name}&gt; has not been excluded from auto-vanguard completion yet.`);
        }
      },
      '$default': () => {
        send(`Invalid argument. usage : vg [add|rm]`);
      }
    });

    // game state
    this.game.on('enter_game', () => {
      this.name = this.game.me.name;
      this.quest_id.length = 0;

      if (this.settings.enable) {
        if (this.settings.charExclusion[this.name]) {
          this.enable = false;
          send(`Player &lt;${this.name}&gt; is currently excluded from auto-vanguard completion.`);
        }
      }
    });

    this.game.me.on('change_zone', () => {
      if (this.enable && this.game.me.inBattleground) {
        this.hold = true;
      } else if (this.enable && this.hold && this.quest_id.length !== 0) {
        this.completeQuest();
        this.hold = false;
      }
    });

    // code
    this.mod.hook('S_COMPLETE_EVENT_MATCHING_QUEST', 1, (e) => {
      if (this.enable) {
        this.quest_id.push(e.id);
        if (!this.hold) {
          this.completeQuest();
        }
        return false;
      }
    });

  }

  destructor() {
    this.cmd.remove('vg');
    
    this.quest_id = undefined;
    this.name = undefined;
    this.hold = undefined;
    this.enable = undefined;

    this.settings = undefined;
    this.game = undefined;
    this.cmd = undefined;
    this.mod = undefined;
  }

  // helper
  completeQuest() {
    while (this.quest_id.length > 0) {
      let myId = this.quest_id.pop();
      this.mod.send('C_COMPLETE_DAILY_EVENT', 1, { id: myId });
    }
    this.mod.setTimeout(() => { this.mod.send('C_COMPLETE_EXTRA_EVENT', 1, { type: 0 }); }, 500);
    this.mod.setTimeout(() => { this.mod.send('C_COMPLETE_EXTRA_EVENT', 1, { type: 1 }); }, 500);
  }

  send() { this.cmd.message(': ' + [...arguments].join('\n\t - ')); }

  // reload
  saveState() {
    let state = {
      enable: this.enable,
      hold: this.hold,
      name: this.name,
      quest_id: this.quest_id
    };
    return state;
  }

  loadState = (state) => {
    this.enable = state.enable;
    this.hold = state.hold;
    this.name = state.name;
    this.quest_id = state.quest_id;
  }

}

module.exports = AutoVanguard;