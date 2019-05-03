'use strict';

const fs = require('fs');
const path = require('path');

const config = require('./config.json');
const data_default = {
  battleground: [
    110,
    111,
    112,
    113,
    115,
    116,
    117,
    118,
    119,
    260,
    265
  ],
  playerExclusion: []
};

module.exports = function AutoVanguard(mod) {
  const cmd = mod.command;

  let data;
  try {
    data = require('./_data.json');
  } catch {
    data = data_default;
  }

  // config
  let enable = config.enable;
  let playerExclusion = data.playerExclusion;

  let hold = false;
  let playerName = '';
  let questId = [];
  let zoneBg = [];

  // command
  cmd.add('vg', {
    '$none': () => {
      enable = !enable;
      send(`${enable ? 'En' : 'Dis'}abled`);
    },
    'add': () => {
      playerExclusion.push(playerName);
      data.playerExclusion = playerExclusion;
      enable = false;
      send(`Added player &lt;${playerName}&gt; to be excluded from auto-vanguard completion.`);
    },
    'rm': () => {
      for (let i = 0, n = playerExclusion.length; i < n; i++) {
        if (playerExclusion[i] === playerName) {
          playerExclusion.splice(i, 1);
          data.playerExclusion = playerExclusion;
          enable = true;
          send(`Removed player &lt;${playerName}&gt; to be included in auto-vanguard completion.`);
          return;
        }
      }
      send(`Player &lt;${playerName}&gt; has not been excluded from auto-vanguard completion yet.`);
    },
    '$default': () => send(`Invalid argument. usage : vg [add|rm]`)
  });

  // game state
  mod.hook('S_LOGIN', mod.majorPatchVersion >= 81 ? 13 : 12, (e) => {
    playerName = e.name;
    questId.length = 0;

    if (enable) {
      for (let i = 0, n = playerExclusion.length; i < n; i++) {
        if (playerExclusion[i] === playerName) {
          enable = false;
          send(`Player &lt;${playerName}&gt; is currently excluded from auto-vanguard completion.`);
          break;
        }
      }
    }
  });

  mod.hook('S_LOAD_TOPO', 3, (e) => {
    if (enable && zoneBg.includes(e)) {
      hold = true;
    } else if (enable && hold && questId.length !== 0) {
      completeQuest();
      hold = false;
    }
  });

  let _ = mod.tryHook('S_BATTLE_FIELD_ENTRANCE_INFO', 1, { order: -1000 }, (e) => zoneBg = [e.zone]);
  if (_ === null) {
    zoneBg = data.battleground;
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

  function saveJsonData() {
    fs.writeFileSync(path.join(__dirname, '_data.json'), JSON.stringify(data, null, 2));
  }

  function send(msg) { cmd.message(': ' + msg); }

  // reload
  this.saveState = () => {
    let state = {
      enable: enable,
      hold: hold,
      playerName: playerName,
      questId: questId
    };
    return state;
  }

  this.loadState = (state) => {
    enable = state.enable;
    hold = state.hold;
    playerName = state.playerName;
    questId = state.questId;
  }

  this.destructor = () => {
    saveJsonData();
    cmd.remove('vg');
  }

}