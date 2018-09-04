// Version 1.40 r:00

const config = require('./config.json');

module.exports = function AutoVanguard(m) {

	// config
	let	enable = config.enable;

	let hold = false,
		questId = 0;

	// command
	// toggle
	m.command.add(['vanguard', 'vg'], {
		$none() {
			enable = !enable;
			send(`${enable ? 'Enabled' : 'Disabled'}`);
		}
	});

	// mod.game
	// disable module for specified job/class in config
	// useful for when accumulating item xp on alternative gear
	// if jobDisable is on, toggle according to configured class
	m.game.on('enter_game', () => {
		let prevState = enable;
		if (!config.jobDisable) return
		(((m.game.me.templateId - 10101) % 100) !== config.job) ? enable = prevState : enable = false
	});

	// if in battleground, hold completion until open world
	// else check if there is a quest to complete
	m.game.on('change_zone', () => {
		if (m.game.me.inBattleground) { hold = true; }
		else if (hold && questId !== 0) { completeQuest(); hold = false; }
	});

	// code
	// if not in battleground, complete vanguard quest
	// otherwise, hold questId for later completion
	m.hook('S_COMPLETE_EVENT_MATCHING_QUEST', 1, (e) => {
		if (!enable) return
		questId = e.id;
		if (!hold) completeQuest();
		return false
	});

	//helper
	// rudimentary attempt to complete both extra events
	// technically, sends at least 1 unnecessary packet every vanguard completion
	function completeQuest() {
		m.send('C_COMPLETE_DAILY_EVENT', 1, { id: questId });
		try {
			setTimeout(() => { m.send('C_COMPLETE_EXTRA_EVENT', 1, { type: 0 }); }, 500);
			setTimeout(() => { m.send('C_COMPLETE_EXTRA_EVENT', 1, { type: 1 }); }, 500);
		} catch (e) {
			// do nothing
		}
		questId = 0;
	}

	function send(msg) { m.command.message(`: ` + msg); }

}