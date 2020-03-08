'use strict';

class auto_vanguard {

  constructor(mod) {

    this.m = mod;
    this.c = mod.command;
    this.g = mod.game;
    this.s = mod.settings;

    // initialize
    this.quest = [];

    // command
    this.c.add('vg', {
      '$none': () => {
        this.s.enable = !this.s.enable;
        this.send(`${this.s.enable ? 'En' : 'Dis'}abled`);
      },
      'add': () => {
        this.s.exclude[this.g.me.name] = true;
        this.send(`Added player &lt;${this.g.me.name}&gt; to be excluded from auto-vanguard completion.`);
      },
      'rm': () => {
        if (this.s.exclude[this.g.me.name]) {
          delete this.s.exclude[this.g.me.name];
          this.send(`Removed player &lt;${this.g.me.name}&gt; to be included in auto-vanguard completion.`);
        } else {
          this.send(`Player &lt;${this.g.me.name}&gt; has not been excluded from auto-vanguard completion yet.`);
        }
      },
      '$default': () => { this.send(`Invalid argument. usage : vg [add|rm]`); }
    });

    // game state
    this.g.on('enter_game', () => {
      this.quest.length = 0;

      if (this.s.exclude[this.g.me.name]) {
        this.send(`Player &lt;${this.g.me.name}&gt; is currently excluded from auto-vanguard completion.`);
      }
    });

    this.g.me.on('change_zone', () => {
      if (this.s.enable && !this.g.me.inBattleground) {
        this.quest.length !== 0 ? this.complete_quest() : null;
      }
    });

    // code
    this.m.hook('S_COMPLETE_EVENT_MATCHING_QUEST', 1, (e) => {
      if (this.s.enable) {
        this.quest.push(e.id);
        !this.g.me.inBattleground ? this.complete_quest() : null;
        return false;
      }
    });

  }

  destructor() { this.c.remove('vg'); }

  // helper
  complete_quest() {
    if (this.s.exclude[this.g.me.name])
      return;

    while (this.quest.length > 0) {
      let myId = this.quest.pop();
      this.m.send('C_COMPLETE_DAILY_EVENT', 1, { id: myId });
    }
    this.m.setTimeout(() => { this.m.send('C_COMPLETE_EXTRA_EVENT', 1, { type: 0 }); }, 500);
    this.m.setTimeout(() => { this.m.send('C_COMPLETE_EXTRA_EVENT', 1, { type: 1 }); }, 500);
  }

  send() { this.c.message(': ' + [...arguments].join('\n - ')); }

  // reload
  saveState() { return this.quest; }

  loadState(state) { this.quest = state; }

}

module.exports = auto_vanguard;