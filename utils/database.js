const { createConnection } = require('mysql');
const { dbInfo } = require('../config.json');

const conn = createConnection(dbInfo);

conn.connect(err => {
    if (err) return console.log(err);
    console.log('Database connected\n');
});

module.exports = {
    guildGetRole: function(guildId, callback) {
        conn.query('SELECT role FROM guilds WHERE id = ?', [guildId], (err, result) => {
            if (err) return console.log(err);
            if (result.length > 0) return callback(result[0].role);
            else module.exports.guildCreate(guildId);
            return '0';
        });
    },
    guildCreate: function(guildId, defaultRole = '0') {
        conn.query('INSERT INTO guilds (id, role) VALUES (?, ?)', [guildId, defaultRole], (err, result) => {
            if (err) {
                if (err === 'ER_DUP_ENTRY') return;
                return console.log(err);
            }
            return result;
        });
    },
    guildSetRole: function(guildId, roleId) {
        conn.query('UPDATE guilds SET role = ? WHERE id = ?', [roleId, guildId], (err, result) => {
            if (err) return console.log(err);
            if (result.length > 0) return result;
            else module.exports.guildCreate(guildId, roleId);
            return '0';
        });
    },
    killConnection: function() {
        conn.end(err => {
            if (err) return console.log(err);
            console.log('Database disconnected\n');
        });
    },
};