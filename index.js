// Version 2.00 r:01
'use strict';

const fs = require('fs');
const path = require('path');

const config = require('./config.json');

module.exports = function AutoVanguard(m) {
    const cmd = m.command || m.require.command;

    let data = config;

    // config
    let enable = data.enable,
        playerExclusion = data.playerExclusion;

    // to remove at next update	
	const default_config = {	
		"enable": true,	
		"playerExclusion": []
	}
	if (!data.playerExclusion) {	
		data = default_config;	
		saveJsonData();	
		console.log(`[auto-vanguard] : Updated config as necessary.`);	
		console.log(`[auto-vanguard] : Specific characters can now be excluded from vanguard completion via : 'vg add'.`);	
		console.log(`[auto-vanguard] : Specific characters can be removed from the exclusion via : 'vg rm'.`);
	}	
    //

    let hold = false,
        playerName = '',
        prevState = enable,
        questId = [];

    // command
    cmd.add('vg', {
        $none() {
            enable = !enable;
            prevState = enable;
            send(`${enable ? 'En' : 'Dis'}abled`);
        },
        add() {
            playerExclusion.push(playerName);
            data.playerExclusion = playerExclusion;
            saveJsonData();
            enable = false;
            send(`Added player "${playerName}" to be excluded from auto-vanguard completion.`);
        },
        rm() {
            for(let i = 0, n = playerExclusion.length; i < n; i++) {
                if (playerExclusion[i] === playerName) {
                    playerExclusion.splice(i, 1);
                    data.playerExclusion = playerExclusion;
                    saveJsonData();
                    enable = true;
                    send(`Removed player "${playerName}" to be included in auto-vanguard completion.`);
                    return;
                }
            }
            send(`Player ${playerName} has not been excluded from auto-vanguard completion yet.`);
        },
        $default() { send(`Invalid argument. usage : vg [add|rm]`); }
    });

    // mod.game
    m.game.on('enter_game', () => {
        playerName = m.game.me.name;
        if (!enable) return;
        prevState = enable;
        for (let i = 0, n = playerExclusion.length; i < n; i++) {
            if (playerExclusion[i] === playerName) {
                enable = false;
                break;
            }
        }
    });

    m.game.me.on('change_zone', () => {
		if (m.game.me.inBattleground) { hold = true; }
		else if (hold && questId.length !== 0) { completeQuest(); hold = false; }
    });
    
    m.game.on('leave_game', () => {
        enable = prevState;
        questId.length = 0;
    });

    // code
    m.hook('S_COMPLETE_EVENT_MATCHING_QUEST', 1, (e) => {
		if (!enable) return
		questId.push(e.id);
		if (!hold) completeQuest();
		return false
    });
    
    // helper
    function completeQuest() {
        for (let i = 0, n = questId.length; i < n; i++) {
            m.send('C_COMPLETE_DAILY_EVENT', 1, { id: questId[i] });
            try {
                setTimeout(() => { m.send('C_COMPLETE_EXTRA_EVENT', 1, { type: 0 }); }, 500);
                setTimeout(() => { m.send('C_COMPLETE_EXTRA_EVENT', 1, { type: 1 }); }, 500);
            } catch (e) {
                // do nothing
            }
        }
    }
    
    function saveJsonData() {
		fs.writeFileSync(path.join(__dirname, './config.json'), JSON.stringify(data));
	}

	function send(msg) { m.command.message(`: ` + msg); }

}