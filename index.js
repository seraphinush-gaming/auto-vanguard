'use strict';

class AutoVanguard {

  constructor(mod) {

    this.mod = mod;
    this.command = mod.command;
    this.hook = null;

    // init
    this.quest = [];

    // command
    mod.command.add('vg', {
      '$none': () => {
        mod.settings.enabled = !mod.settings.enabled;
        this.send(`${mod.settings.enabled ? 'En' : 'Dis'}abled`);
      },
      'add': () => {
        mod.settings.exclude[mod.game.me.name] = true;
        this.send(`Added player &lt;${mod.game.me.name}&gt; to be excluded from auto-vanguard completion.`);
      },
      'rm': () => {
        if (!mod.settings.exclude[mod.game.me.name])
          return this.send(`Player &lt;${mod.game.me.name}&gt; has not been excluded from auto-vanguard completion yet.`);

        delete mod.settings.exclude[mod.game.me.name];
        this.send(`Removed player &lt;${mod.game.me.name}&gt; to be included in auto-vanguard completion.`);
      },
      '$default': () => { this.send(`Invalid argument. usage : vg [add|rm]`); }
    });

    // game state
    mod.game.on('enter_game', () => {
      this.quest.length = 0;

      if (mod.settings.exclude[mod.game.me.name])
        this.send(`Player &lt;${mod.game.me.name}&gt; is currently excluded from auto-vanguard completion.`);
    });

    mod.game.me.on('change_zone', () => {
      if (mod.settings.enabled && !mod.game.me.inBattleground)
        if (this.quest.length !== 0) this.complete_quest();
    });

    // code
    this.hook = mod.hook('S_COMPLETE_EVENT_MATCHING_QUEST', 1, (e) => {
      if (mod.settings.enabled) {
        if (this.mod.settings.exclude[this.mod.game.me.name])
          return;

        this.quest.push(e.id);
        if (!mod.game.me.inBattleground) this.complete_quest();
        return false;
      }
    });

  }

  destructor() {
    this.command.remove('vg');
    this.mod.unhook(this.hook);
    this.hook = null;
  }

  // helper
  complete_quest() {
    while (this.quest.length > 0) {
      let myId = this.quest.pop();
      this.mod.send('C_COMPLETE_DAILY_EVENT', 1, { id: myId });
    }
    this.mod.setTimeout(() => { this.mod.send('C_COMPLETE_EXTRA_EVENT', 1, { type: 0 }); }, 500);
    this.mod.setTimeout(() => { this.mod.send('C_COMPLETE_EXTRA_EVENT', 1, { type: 1 }); }, 500);
  }

  send(msg) { this.command.message(': ' + msg); }

  // reload
  saveState() { return this.quest; }

  loadState(state) { this.quest = state; }

}

module.exports = { NetworkMod: AutoVanguard };