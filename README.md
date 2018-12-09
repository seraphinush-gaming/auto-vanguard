> [![paypal](https://img.shields.io/badge/paypal-donate-333333.svg?colorA=253B80&colorB=333333)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=B7QQJZV9L5P2J&source=url) [![paypal.me](https://img.shields.io/badge/paypal.me-donate-333333.svg?colorA=169BD7&colorB=333333)](https://www.paypal.me/seraphinush) 
>
> Support seraph via paypal donations, thanks in advance !

# auto-vanguard
tera-proxy module to automatically turn in Vanguard Requests upon completion

## Auto-update guide
- Create a folder called `auto-vanguard` in `tera-proxy/mods` and download >> [`module.json`](https://raw.githubusercontent.com/seraphinush-gaming/auto-vanguard/master/module.json) << (right-click this link and save as..) into the folder

## Dependency
- `command` module
- `tera-game-state` module

## Usage
- __`vg`__
  - Toggle on/off

### Parameters
- __`add`__
  - Add player to character-specific exclusion from auto-vangaurd completion
- __`rm`__
  - Remove player from character-specific exclusion from auto-vanguard completion

## Config
- __`enable`__
  - Initialize module on/off
  - Default is `true`

## Info
- Original author : [baldera-mods](https://github.com/baldera-mods)

## Changelog
<details>

    2.01
    - Updated for caali-proxy-nextgen
    2.00
    - Removed `jobDisable` from config
    - Removed `job` from config
    - Added `add` parameter
    - Added `rm` parameter
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