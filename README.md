# colors-js

Public invite [here](https://3zachm.dev/asayake/)!

Made in the disappearance of Hex bot

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
