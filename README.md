# colors-js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/3zachm/colors-js/blob/main/LICENSE)
[![CodeFactor](https://www.codefactor.io/repository/github/3zachm/colors-js/badge)](https://www.codefactor.io/repository/github/3zachm/colors-js)
[![Discord Bots](https://top.gg/api/widget/servers/907538185976946720.svg)](https://top.gg/bot/907538185976946720)

Public invite [here](https://3zachm.dev/asayake/)!

Made in the disappearance of Hex bot

![asayake](https://3zachm.dev/img/asayake2.webp)

## Commands

- `/role set` - Set role allowed to use colors
- `/role reset` - Allow everyone to set colors (default)
- `/role view` - View current role allowed to set colors
- `/color set color:#000000` - Set user role color to provided hex
- `/color reset` - Remove user role color
- `/color view` - View current color
- `/ping` - Test command

## SQL "Setup"

`create table guilds(id varchar(128), role varchar(128), primary key (id));`
