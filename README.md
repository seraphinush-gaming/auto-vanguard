```
Support seraph via donations, thanks in advance !
```

# auto-vanguard [![](https://img.shields.io/badge/paypal-donate-333333.svg?colorA=0070BA&colorB=333333)](https://www.paypal.me/seraphinush) [![](https://img.shields.io/badge/patreon-pledge-333333.svg?colorA=F96854&colorB=333333)](https://www.patreon.com/seraphinush)
tera-toolbox module to automatically turn in Vanguard Requests upon completion

## Auto-update guide
- Create a folder called `auto-vanguard` in `tera-toolbox/mods` and download >> [`module.json`](https://raw.githubusercontent.com/seraphinush-gaming/auto-vanguard/master/module.json) << (right-click this link and save link as..) into the folder

## Usage
- `vg`
  - Toggle

### Parameters
- `add`
  - Add character to character-specific exclusion from auto-Vanguard Request completion
- `rm`
  - Remove character from character-specific exclusion from auto-Vanguard Request completion

## Info
- Original author : [baldera-mods](https://github.com/baldera-mods)

## Changelog
<details>

    3.00
    - Update module as class export
    2.05
    - Reinstated `tera-game-state`
    - Removed `S_BATTLE_FIELD_ENTRANCE_INFO` hook
    2.04
    - Added settings-migrator support
    2.03
    - Removed `tera-game-state` usage
    2.02
    - Added hot-reload support
    2.01
    - Updated for caali-proxy-nextgen
    2.00
    - Removed `jobDisable` from config
    - Removed `job` from config
    - Added `add` parameter
    - Added `rm` parameter
    1.40
    - Removed `Command` require()
    - Removed `tera-game-state` require()
    - Updated to `mod.command`
    - Updated to `mod.game`
    1.39
    - Removed font color bloat
    - Added `tera-game-state` dependency
    1.38
    - Fixed issue where disabling module by setting `enable = false` would change while `jobDisable = true`
    1.37
    - Added job disable options to config file
    1.36
    - Added auto-update support
    - Refactored config file
    -- Added `enable`
    1.35
    - Added Battlegrounds support
    1.34
    - Updated font color
    1.33
    - Updated code aesthetics
    - Added personal class-specific auto enable/disable (commented out)
    1.32
    - Updated code
    - Added string function
    1.31
    - Updated code aesthetics
    1.30
    - Updated code aesthetics
    1.20
    - Removed protocol version restriction
    1.10
    - Personalized code aesthetics
    1.00
    - Initial fork

</details>