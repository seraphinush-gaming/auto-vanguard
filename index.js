'use strict';

module.exports = function AutoVanguard(mod) {
  const cmd = mod.command;

  let settings = mod.settings;

  let enable = true;
  let hold = false;
  let myName = '';
  let questId = [];
  let zoneBg = [];

  // command
  cmd.add('vg', {
    '$none': () => {
      settings.enable = !settings.enable;
      enable = settings.enable;
      send(`${settings.enable ? 'En' : 'Dis'}abled`);
    },
    'add': () => {
      settings.charExclusion[myName] = true;
      enable = false;
      send(`Added player &lt;${myName}&gt; to be excluded from auto-vanguard completion.`);
    },
    'rm': () => {
      if (settings.charExclusion[myName]) {
        delete settings.charExclusion[myName];
        enable = true;
        send(`Removed player &lt;${myName}&gt; to be included in auto-vanguard completion.`);
      } else {
        send(`Player &lt;${myName}&gt; has not been excluded from auto-vanguard completion yet.`);
      }
    },
    '$default': () => send(`Invalid argument. usage : vg [add|rm]`)
  });

  // game state
  mod.hook('S_LOGIN', mod.majorPatchVersion >= 81 ? 13 : 12, (e) => {
    myName = e.name;
    questId.length = 0;

    if (settings.enable) {
      if (settings.charExclusion[myName]) {
        enable = false;
        send(`Player &lt;${myName}&gt; is currently excluded from auto-vanguard completion.`);
      }
    }
  });

  mod.hook('S_LOAD_TOPO', 3, (e) => {
    if (enable && zoneBg.includes(e.zone)) {
      hold = true;
    } else if (enable && hold && questId.length !== 0) {
      completeQuest();
      hold = false;
    }
  });

  let _ = mod.tryHook('S_BATTLE_FIELD_ENTRANCE_INFO', 1, { order: -1000 }, (e) => zoneBg = [e.zone]);
  if (_ === null) {
    zoneBg = settings.battleground;
    console.log('Unmapped protocol packet \<S_BATTLE_FIELD_ENTRANCE_INFO\>.');
  }

  // code
  mod.hook('S_COMPLETE_EVENT_MATCHING_QUEST', 1, (e) => {
    if (enable) {
      questId.push(e.id);
      if (!hold) {
        completeQuest();
      }
      return false;
    }
  });

  // helper
  function completeQuest() {
    while (questId.length > 0) {
      let myId = questId.pop();
      mod.send('C_COMPLETE_DAILY_EVENT', 1, { id: myId });
    }
    setTimeout(() => { mod.trySend('C_COMPLETE_EXTRA_EVENT', 1, { type: 0 }); }, 500);
    setTimeout(() => { mod.trySend('C_COMPLETE_EXTRA_EVENT', 1, { type: 1 }); }, 500);
  }

  function send(msg) { cmd.message(': ' + msg); }

  // reload
  this.saveState = () => {
    let state = {
      enable: enable,
      hold: hold,
      myName: myName,
      questId: questId
    };
    return state;
  }

  this.loadState = (state) => {
    enable = state.enable;
    hold = state.hold;
    myName = state.myName;
    questId = state.questId;
  }

  this.destructor = () => {
    cmd.remove('vg');
  }

}