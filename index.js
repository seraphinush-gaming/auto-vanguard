'use strict';

const fs = require('fs');
const path = require('path');

const config = require('./config.json');

module.exports = function AutoVanguard(mod) {
    const cmd = mod.command || mod.require.command;

    // config
    let data = config,
        enable = data.enable,
        playerExclusion = data.playerExclusion;

    let hold = false,
        playerName = '',
        prevState = enable,
        questId = [];

    // command
    cmd.add('vg', {
        '$none': () => {
            enable = !enable;
            prevState = enable;
            send(`${enable ? 'En' : 'Dis'}abled`);
        },
        'add': () => {
            playerExclusion.push(playerName);
            data.playerExclusion = playerExclusion;
            saveJsonData();
            enable = false;
            send(`Added player &lt;${playerName}&gt; to be excluded from auto-vanguard completion.`);
        },
        'rm': () => {
            for (let i = 0, n = playerExclusion.length; i < n; i++) {
                if (playerExclusion[i] === playerName) {
                    playerExclusion.splice(i, 1);
                    data.playerExclusion = playerExclusion;
                    saveJsonData();
                    enable = true;
                    send(`Removed player &lt;${playerName}&gt; to be included in auto-vanguard completion.`);
                    return;
                }
            }
            send(`Player &lt;${playerName}&gt; has not been excluded from auto-vanguard completion yet.`);
        },
        '$default': () => send(`Invalid argument. usage : vg [add|rm]`)
    });

    // mod.game
    mod.game.on('enter_game', () => {
        playerName = mod.game.me.name;
        if (!enable)
            return;
        prevState = enable;
        for (let i = 0, n = playerExclusion.length; i < n; i++) {
            if (playerExclusion[i] === playerName) {
                enable = false;
                break;
            }
        }
    });

    mod.game.me.on('change_zone', () => {
        if (mod.game.me.inBattleground) {
            hold = true;
        }
        else if (hold && questId.length !== 0) {
            completeQuest();
            hold = false;
        }
    });

    mod.game.on('leave_game', () => {
        enable = prevState;
        questId.length = 0;
    });

    // code
    mod.hook('S_COMPLETE_EVENT_MATCHING_QUEST', 1, (e) => {
        if (!enable)
            return;
        questId.push(e.id);
        if (!hold) completeQuest();
        return false;
    });

    // helper
    function completeQuest() {
        for (let i = 0, n = questId.length; i < n; i++) {
            mod.send('C_COMPLETE_DAILY_EVENT', 1, { id: questId[i] });
            setTimeout(() => { mod.send('C_COMPLETE_EXTRA_EVENT', 1, { type: 0 }); }, 500);
            setTimeout(() => { mod.send('C_COMPLETE_EXTRA_EVENT', 1, { type: 1 }); }, 500);
        }
    }

    function saveJsonData() {
        fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify(data));
    }

    function send(msg) { cmd.message(': ' + msg); }

    // reload
    this.saveState = () => {
        let state = {
            enable: enable,
            hold: hold,
            prevState: prevState,
            questId: questId
        };
        return state;
    }

    this.loadState = (state) => {
        enable = state.enable;
        hold = state.hold;
        playerName = mod.game.me.name;
        prevState = state.prevState
        questId = state.questId;
    }

    this.destructor = () => { cmd.remove('vg'); }

}