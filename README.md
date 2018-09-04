# auto-vanguard
tera-proxy module to automatically turn in Vanguard Initiative requests upon completion

## Dependency
- `command` module
- `tera-game-state` module

## Usage
- __`vanguard` · `vg`__
  - Toggle on/off

## Config
- __`enable`__
  - Initialize module on/off
  - Default is `true`
- __`job`__
  - Specify class to automatically turn module off
  - Default is archer : `5`
  - Classes are numerically specified by :
```
        0 :  Warrior
        1 :  Lancer
        2 :  Slayer
        3 :  Berserker
        4 :  Sorcerer
        5 :  Archer
        6 :  Priest
        7 :  Mystic
        8 :  Reaper
        9 :  Gunner
        10 : Brawler
        11 : Ninja
        12 : Valkyrie
```
- __`jobDisable`__
  - Automatically turn module on/off for specified class denoted at `job`
  - Default is `false`

## Info
- Original author : [baldera-mods](https://github.com/baldera-mods)
- **Support seraph via paypal donations, thanks in advance : [paypal](https://www.paypal.me/seraphinush)**

## Changelog
<details>

    1.40
    - Removed `command` require()
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